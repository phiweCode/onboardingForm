const {
    addNewVisitor,
    listAllVisitors,
    deleteAVisitor,
    updateAVisitor,
    viewOneVisitor,
    deleteAllVisitors,
} = require("../models/db_services.js");
const path = require("path")
const {
    attributeNameConvertor,
    errorMessages
} = require('../utils/utils.js')

const listVisitors = async (_req, _res, _next) => await listAllVisitors()

const createVisitor = async (req, _res, _next) => {
    const {
        name,
        age,
        dateOfVisit,
        timeOfVisit,
        assistorName,
        comments
    } = req.body

    let response = await addNewVisitor({
        name,
        age,
        dateOfVisit,
        timeOfVisit,
        assistorName,
        comments
    })
    response.date_of_visit = new Date(response.date_of_visit).toISOString().split("T")[0]
    response = attributeNameConvertor("from database", response)
    return response
}

const showVisitorDetails = async (req, _res, _next) => {
    const id = parseInt(req.params.id)
    let results = await viewOneVisitor(id)
    results.date_of_visit = new Date(results.date_of_visit).toISOString().split("T")[0]
    results = attributeNameConvertor("from database", results)
    return results
}

const deleteVisitor = async (req, _res, _next) => {
    const id = parseInt(req.params.id)
    return await deleteAVisitor(id)
}

const deleteVisitors = async (_req, _res, _next) => await deleteAllVisitors()

const updateVisitor = async (req, _res, _next) => {

    if (Object.keys(req.body).length > 1)
        throw new Error(errorMessages.UPDATES)

    const id = parseInt(req.params.id)
    const columnName = Object.keys(req.body)[0]
    const columnValue = Object.values(req.body)[0]

    return await updateAVisitor(id, columnName, columnValue)
}

const createNewVisitorForm = (_req, _res) => path.join(__dirname, '../../public', 'index.html')


const createNewVisitor = async (req, _res) => {

    let userData = {
        ...req.body
    };
    let cleanedData = {
        name: `${userData.fullName}`,
        age: Number(userData.age),
        dateOfVisit: userData.dateOfVisit,
        timeOfVisit: userData.timeOfVisit,
        assistorName: `${userData.assistantFullName}`,
        comments: String(userData.comments).trim()
    }

    const results = await addNewVisitor(cleanedData);
    results.date_of_visit = new Date(results.date_of_visit).toISOString().split("T")[0];
    return results
}


module.exports = {
    listVisitors,
    listAllVisitors,
    createVisitor,
    showVisitorDetails,
    deleteVisitor,
    deleteVisitors,
    updateVisitor,
    createNewVisitorForm,
    createNewVisitor
}