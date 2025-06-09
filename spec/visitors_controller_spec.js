const {
  createTable,
  addNewVisitor,
  listAllVisitors,
  deleteAVisitor,
  updateAVisitor,
  viewOneVisitor,
  viewLastVisitor,
  deleteAllVisitors,
  performQuery
} = require("../src/models/db_services.js");
const {
  successMessages,
  errorMessages
} = require('../src/utils/utils.js')
const {
  queryStrings
} = require('../src/utils/queries.js');
const {
  pool
} = require('../src/config/config.js')


describe("database operations", () => {
  let models
  beforeEach(() => {
    spyOn(pool, "connect").and.returnValue({
      query: jasmine.createSpy("query").and.callFake((query, values, specialCase = false) => {
        if (query === queryStrings.CREATE_TABLES) {
          return Promise.resolve(successMessages.TABLE_CREATION)
        } else if (query === queryStrings.ADD_NEW_VISITOR) {
          return Promise.resolve({
            rows: [{
              id: 1,
              name: "Name Surname",
              age: 26,
              dateOfVisit: "2022-12-31",
              timeOfVisit: "12:00",
              assistorName: "Assistor",
              comments: "This is a valid comment",
            }, ],
          });
        } else if (query === queryStrings.LIST_ALL_USERS) {
          return Promise.resolve({
            rows: [{
                id: 1,
                name: "Sipho Nkosi"
              },
              {
                id: 2,
                name: "Nomvula Dlamini"
              },
              {
                id: 3,
                name: "Kabelo Mokoena"
              },
              {
                id: 4,
                name: "Ayanda Zulu"
              },
              {
                id: 5,
                name: "Zodwa Mbatha"
              },
              {
                id: 6,
                name: "Sizwe Khumalo"
              },
            ],
          });
        } else if (query === queryStrings.DELETE_A_VISITOR) {
          if (values[0] === 3) {
            return Promise.resolve(successMessages.deleteVisitor(3));
          } else {
            return Promise.resolve({
              rows: []
            });
          }
        } else if (
          query === queryStrings.GET_A_VISITOR &&
          (values[0] === 3 || values[0] === 4)
        ) {
          if (values[0] === 3) {
            return Promise.resolve({
              rows: [{
                id: 3,
                name: "Thabo Mngoma",
                age: 26,
                date_of_visit: "2015-08-31T22:00:00.000Z",
                time_of_visit: "12:00:00",
                assistor_name: "Karen James",
                comments: "This is a valid comment",
              }, ],
            });
          }
          return Promise.reject(new Error(errorMessages.nonExistentVisitor(4)));
        } else if (query === queryStrings.GET_LATEST_VISITOR) {
          return Promise.resolve({
            rows: [{
              id: 1,
              name: "Sipho Nkosi",
              age: 26,
              date_of_visit: "2015-08-31T22:00:00.000Z",
              time_of_visit: "12:00:00",
              assistor_name: "Karen James",
              comments: "What are the requirements to join the institution",
            }, ],
          });
        } else if (query === queryStrings.DELETE_ALL_VISITORS) {
          return Promise.resolve(successMessages.DELETE_ALL_VISITORS);
        } else if (query === queryStrings.updateVisitor(1, "name", "Thabo Mngoma"))
          return Promise.resolve(successMessages.updateVisitor(1));
        else return Promise.reject(new Error("Invalid query used"));
      }),
      release: jasmine.createSpy("release"),
    });
    models = require("../src/models/db_services.js");

  });

  describe("performQuery", () => {
    it("should query the database using the client instance", async () => {
      await performQuery(queryStrings.ADD_NEW_VISITOR);
      expect(pool.connect().query).toHaveBeenCalledOnceWith(
        queryStrings.ADD_NEW_VISITOR,
        []
      );
    });

    it("should throw an error if an invalid query is used", async () => {
      try {
        await performQuery("INVALID QUERY");
        fail("Expected an error to be thrown");
      } catch (err) {
        expect(err.message).toBe("Invalid query used");
      } finally {
        expect(pool.connect().query).toHaveBeenCalledOnceWith("INVALID QUERY", []);
      }
    });

    it("should return the requested data from a given query", async () => {
      let result = await performQuery(queryStrings.GET_A_VISITOR, [3]);
      expect(pool.connect().query).toHaveBeenCalledOnceWith(
        queryStrings.GET_A_VISITOR,
        [3]
      );

      expect(result).toEqual([{
        id: 3,
        name: "Thabo Mngoma",
        age: 26,
        date_of_visit: "2015-08-31T22:00:00.000Z",
        time_of_visit: "12:00:00",
        assistor_name: "Karen James",
        comments: "This is a valid comment",
      }, ]);
      expect(pool.connect().release).toHaveBeenCalledOnceWith();
    });
  });

  describe("createTable", () => {
    it("should create a new table for the visitors", async () =>
      await expectAsync(createTable()).toBeResolvedTo(successMessages.TABLE_CREATION));
  })

  describe("addNewVisitor", () => {
    let invalidData;

    beforeEach(() => {
      invalidData = {
        name: "Name Surname",
        age: 26,
        dateOfVisit: "2022-12-31",
        timeOfVisit: "12:00",
        assistorName: "Assistor",
        comments: "This is a valid comment",
      };
    })

    it("should add a new visitor to the database", async () => {
      const userData = {
        name: "Name Surname",
        age: 26,
        dateOfVisit: "2022-12-31",
        timeOfVisit: "12:00",
        assistorName: "Assistor",
        comments: "This is a valid comment",
      };

      await expectAsync(addNewVisitor(userData)).toBeResolvedTo({
        id: 1,
        ...userData
      })
    });

    it("should throw an error if the name is not a string", async () => {
      invalidData.name = 165466544
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("name", invalidData["name"])))
    });

    it("should throw an error if the name is empty", async () => {
      invalidData.name = ""
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("name", invalidData["name"])))
    });

    it("should throw an error if the name is longer than 20 characters", async () => {
      invalidData.name = "A".repeat(21)
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("name", invalidData["name"])))
    });

    it("should throw an error if the name contains invalid characters", async () => {
      invalidData.name = "N@m3"
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("name", invalidData["name"])))
    });

    it("should throw an error if the age is not a number", async () => {
      invalidData.age = "twenty six"
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("age", invalidData["age"])))
    });

    it("should throw an error if the age is more than 130", async () => {
      invalidData.age = 130
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("age", invalidData["age"])))
    });

    it("should throw an error if the date is not in a valid format", async () => {
      invalidData.dateOfVisit = "0102/18/20"
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("dateOfVisit", invalidData["dateOfVisit"])))
    });

    it("should throw an error if the time is out of range", async () => {
      invalidData.timeOfVisit = "24:00"
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("timeOfVisit", invalidData["timeOfVisit"])))
    });

    it("should throw an error if the comment is longer than 200 characters", async () => {
      invalidData.comments = "A".repeat(201)
      await expectAsync(addNewVisitor(invalidData))
        .toBeRejectedWith(new Error(errorMessages.invalidInput("comments", invalidData["comments"])))
    });
  });

  describe("listAllVisitors", () => {
    it("should return a list of all visitors in the database", async () => {

      await expectAsync(listAllVisitors()).toBeResolvedTo([{
          id: 1,
          name: "Sipho Nkosi"
        },
        {
          id: 2,
          name: "Nomvula Dlamini"
        },
        {
          id: 3,
          name: "Kabelo Mokoena"
        },
        {
          id: 4,
          name: "Ayanda Zulu"
        },
        {
          id: 5,
          name: "Zodwa Mbatha"
        },
        {
          id: 6,
          name: "Sizwe Khumalo"
        },
      ])

    });
  });

  describe("deleteAVisitor", () => {
    it("should successfully delete a visitor", async () => {
      await expectAsync(deleteAVisitor(3)).toBeResolvedTo(successMessages.deleteVisitor(3))
    });

    it("should throw an error when trying to delete a nonExistent visitor", async () => {
      spyOn(models, 'deleteAVisitor').and.returnValue(Promise.reject(errorMessages.nonExistentVisitor([7])))
      await expectAsync(deleteAVisitor(7)).toBeRejectedWith(new Error(errorMessages.nonExistentVisitor([7])))
    });

    it("should throw an error if the visitor id is not provided", async () => {
      await expectAsync(deleteAVisitor()).toBeRejectedWith(new Error(errorMessages.invalidInput("id")))
    })
  });

  describe("updateAVisitor", () => {
    it("should update a visitor's data given the visitor's id", async () => {
      await expectAsync(updateAVisitor(1, "name", "Thabo Mngoma")).toBeResolvedTo(successMessages.updateVisitor(1))
    });

    it("should throw an error if the input value is invalid", async () => {
      await expectAsync(updateAVisitor(1, "name", 12345)).toBeRejectedWith(new Error(errorMessages.invalidInput("name", 12345)))
    })
  });

  describe("viewOneVisitor", () => {
    it("should return a visitor's record given the visitor's id", async () => {
      await expectAsync(viewOneVisitor(3)).toBeResolvedTo({
        id: 3,
        name: "Thabo Mngoma",
        age: 26,
        date_of_visit: "2015-08-31T22:00:00.000Z",
        time_of_visit: "12:00:00",
        assistor_name: "Karen James",
        comments: "This is a valid comment",
      })
    });

    it("should throw an error when trying to get a visitor with a non-existent id", async () => {
      spyOn(models, 'viewOneVisitor').and.returnValue(Promise.reject(errorMessages.nonExistentVisitor(4)))
      await expectAsync(viewOneVisitor(4)).toBeRejectedWith(new Error(errorMessages.nonExistentVisitor(4)))
    });
  });

  describe("viewLastVisitor", () => {
    it("should return the last visitor in the database", async () => {
      await expectAsync(viewLastVisitor()).toBeResolvedTo({
        id: 1,
        name: "Sipho Nkosi",
        age: 26,
        date_of_visit: "2015-08-31T22:00:00.000Z",
        time_of_visit: "12:00:00",
        assistor_name: "Karen James",
        comments: "What are the requirements to join the institution",
      })
    });

    it("should return a message stating that there are no visitors in the database if there is no last visitor", async () => {
      pool.connect.and.returnValue({
        query: jasmine.createSpy("query").and.returnValue({
          rows: []
        }),
        release: jasmine.createSpy("release"),
      });
      await expectAsync(viewLastVisitor()).toBeResolvedTo(successMessages.VISITOR_NOT_FOUND);
    });

  });

  describe("deleteAllVisitors", () => {
    it("should delete all visitor records in the database", async () => {
      await expectAsync(deleteAllVisitors()).toBeResolvedTo(successMessages.DELETE_ALL_VISITORS)
    });

    it("should check if the database has records before attempting to delete records", async () => {

      pool.connect.and.returnValue({
        query: jasmine.createSpy("query").and.returnValue({
          rows: []
        }),
        release: jasmine.createSpy("release"),
      });

      await expectAsync(deleteAllVisitors()).toBeResolvedTo(successMessages.VISITOR_NOT_FOUND)
    })
  });
});
