const successMessages = {
  updateVisitor: (id) => `Visitor with ID ${id} updated successfully.`,
  deleteVisitor: (id) => `Visitor with ID ${id} deleted successfully.`,
  DELETE_ALL_VISITORS: `Deleted all visitors successfully.`,
  TABLE_CREATION: `Table created successfully.`,
  VISITOR_NOT_FOUND: "There currently no visitors in the database."
}

const validatorRegexTests = {
  dateInputs: /^([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}|[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2})$/,
  timeInputs: /^(([0-1][0-9]|2[0-3]):[0-5][0-9]|([0-1][0-ls9]|2[0-3]):[0-5][0-9]:[0-5][0-9])$/,
  nameInputs: /^[a-z]+|( ?[a-z]+)$/,
  commentInputs: /^.{0,200}$/,

};

const errorMessages = {
  invalidInput: (attribute, inputValue) => {
    const baseError = `Invalid input from ${attribute} with value ${inputValue}: `;
    const attributeMessages = {
      id: () => baseError + `The passed id: ${inputValue} is invalid. The visitor id must be a positive integer.`,
      name: () => baseError + 'The name should at least contain the first name of the visitor and/or the last name of the visitor i.e "Spider Man".',
      age: () => baseError + "The age should be a positive integer less than 130.",
      dateOfVisit: () => baseError + "The date of visit should be in the format YYYY-MM-DD or MM/DD/YYYY.",
      timeOfVisit: () => baseError + "The time of visit should be in the format HH:MM:SS or HH:MM.",
      assistorName: () => baseError + "The assistor's name should be a string containing only alphabetic characters.",
      comments: () => baseError + "The comments should be a string no longer than 200 characters."
    };
    return (attributeMessages[attribute] || (() => "Unexpected error encountered"))();
  },
  nonExistentVisitor: (id) => `The Visitor with the id: ${id} does not exist`,
  NO_DATA_PROVIDED: "No valid data provided for validation",
  invalidId: (id) => `The passed id: ${id} is invalid. The visitor id must be a positive integer.`,
  INVALID_FIELD_NAME_USED: `Invalid field name used, i.e, supported field names are: \n["name", "age", "dateOfVisit", "timeOfVisit", "assistorName", "comments"]\n`,
  UPDATES: "You can only update one field at a time",
};

const namesInput = (name) =>
  typeof name === "string" &&
  name.trim() !== "" &&
  name.length <= 20 &&
  validatorRegexTests.nameInputs.test(name);

const inputValidatorObject = {
  id: (id) => Number(id) === id && id > 0,
  name: (name) => namesInput(name),
  age: (age) =>
    typeof age === "number" && age === Math.abs(parseInt(age)) && age < 130,
  dateOfVisit: (date) =>
    validatorRegexTests.dateInputs.test(date) && typeof date == "string",
  timeOfVisit: (time) =>
    validatorRegexTests.timeInputs.test(time) && typeof time == "string",
  assistorName: (assistorName) => namesInput(assistorName),
  comments: (comments) =>
    typeof comments === "string" &&
    validatorRegexTests.commentInputs.test(comments),
};

const attributeNameConvertor = (destination, object) => {
  const processedObject = {};

  switch (destination) {
    case "to database":
      Object.keys(object).forEach((key) => {
        switch (key) {
          case "id":
            processedObject["id"] = object["id"];
          case "name":
            processedObject["name"] = object["name"];
            break;
          case "age":
            processedObject["age"] = object["age"];
            break;
          case "dateOfVisit":
            processedObject["date_of_visit"] = object["dateOfVisit"];
            break;
          case "timeOfVisit":
            processedObject["time_of_visit"] = object["timeOfVisit"];
            break;
          case "assistorName":
            processedObject["assistor_name"] = object["assistorName"];
            break;
          case "comments":
            processedObject["comments"] = object["comments"];
            break;
          default:
            throw new Error(`Unsupported field used: ${key}`);
        }
      });
      break;

    case "from database":
      Object.keys(object).forEach((key) => {
        switch (key) {
          case "id":
            processedObject["id"] = object["id"]
          case "name":
            processedObject["name"] = object["name"];
            break;
          case "age":
            processedObject["age"] = object["age"];
            break;
          case "date_of_visit":
            processedObject["dateOfVisit"] = object["date_of_visit"];
            break;
          case "time_of_visit":
            processedObject["timeOfVisit"] = object["time_of_visit"];
            break;
          case "assistor_name":
            processedObject["assistorName"] = object["assistor_name"];
            break;
          case "comments":
            processedObject["comments"] = object["comments"];
            break;
          default:
            throw new Error(`Unsupported field used: ${key}`);
        }
      });
      break;

    default:
      throw new Error("Invalid conversion type specified, use \"to database\" or \"from database\"");
  }

  return processedObject;
};

module.exports = {
  successMessages,
  validatorRegexTests,
  errorMessages,
  inputValidatorObject,
  attributeNameConvertor
}
