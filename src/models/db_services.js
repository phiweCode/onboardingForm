const {
  pool
} = require('../config/config')
const {
  queryStrings
} = require('../utils/queries')
const {
  successMessages,
  inputValidatorObject,
  errorMessages,
  attributeNameConvertor
} = require('../utils/utils')

const validateInput = (data = null) => {

  if (!data || typeof data !== 'object') {
    throw new Error(errorMessages.NO_DATA_PROVIDED);
  }

  try {
    for (let attribute in data) {
      if (inputValidatorObject[attribute](data[attribute]) === false)
        throw new Error(errorMessages.invalidInput(attribute, data[attribute]));
    }
  } catch (error) {
    if (error.message == `inputValidatorObject[attribute] is not a function`) {
      error.statusCode = 400
      error.message = errorMessages.INVALID_FIELD_NAME_USED
      throw error
    }
    throw error
  }

}

const performQuery = async (query, values = null) => {
  let client = await pool.connect();
  const results = await client.query(query, values ? values : []);
  client.release();

  return results.rows;
}

const createTable = async () => {
  const query = queryStrings.CREATE_TABLES;
  await performQuery(query);
  return successMessages.TABLE_CREATION
}

const addNewVisitor = async (data) => {
  validateInput(data);
  const {
    name,
    age,
    dateOfVisit,
    timeOfVisit,
    assistorName,
    comments
  } = data;
  const query = queryStrings.ADD_NEW_VISITOR;
  const values = [
    name,
    age,
    dateOfVisit,
    timeOfVisit,
    assistorName,
    comments || "No comment",
  ];
  const result = await performQuery(query, values);
  return result[0];
}

const listAllVisitors = async () => {
  const query = queryStrings.LIST_ALL_USERS;
  let result = performQuery(query);
  return result;
}

const deleteAVisitor = async (id) => {
  validateInput({
    id
  })
  const query = queryStrings.DELETE_A_VISITOR;
  const result = await performQuery(query, [id]);
  if (result?.length == 0)
    throw new Error(errorMessages.nonExistentVisitor(id));
  return successMessages.deleteVisitor(id)
}

const updateAVisitor = async (id, columnName, value) => {
  validateInput({
    id
  })
  const data = {
    [columnName]: value
  };
  validateInput(data);
  columnName = Object.keys(attributeNameConvertor("to database", data))[0]
  const query = queryStrings.updateVisitor(id, columnName, value);
  const result = await performQuery(query);
  if (result?.length === 0)
    throw new Error(errorMessages.nonExistentVisitor(id));
  return successMessages.updateVisitor(id);
}

const viewOneVisitor = async (id) => {
  validateInput({
    id
  })
  const query = queryStrings.GET_A_VISITOR;
  const result = await performQuery(query, [id]);
  if (result?.length === 0)
    throw new Error(errorMessages.nonExistentVisitor(id))
  return result[0];
}

const viewLastVisitor = async () => {
  const query = queryStrings.GET_LATEST_VISITOR;
  const result = await performQuery(query);
  if (result.length === 0) return successMessages.VISITOR_NOT_FOUND
  return result[0];
}

const deleteAllVisitors = async () => {
  const isDatabaseEmpty = await listAllVisitors()
  if (isDatabaseEmpty.length !== 0) {
    const query = queryStrings.DELETE_ALL_VISITORS;
    await performQuery(query);
    return successMessages.DELETE_ALL_VISITORS;
  }

  return successMessages.VISITOR_NOT_FOUND
}

module.exports = {
  createTable,
  addNewVisitor,
  listAllVisitors,
  deleteAVisitor,
  updateAVisitor,
  viewOneVisitor,
  viewLastVisitor,
  deleteAllVisitors,
  validateInput,
  performQuery
}
