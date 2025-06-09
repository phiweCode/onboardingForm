const router = require('express').Router();
const visitorController = require("../controllers/visitor_controllers.js");
const processRequest = require('../middleware/process_request_middleware.js');

router
    .get('/new_visitor', processRequest(visitorController.createNewVisitorForm))
    .post('/thank_you', processRequest(visitorController.createNewVisitor));

router.route('/visitors')
    .get(processRequest(visitorController.listVisitors))
    .post(processRequest(visitorController.createVisitor, 201))
    .delete(processRequest(visitorController.deleteVisitors))

router.route('/visitors/:id')
    .get(processRequest(visitorController.showVisitorDetails))
    .delete(processRequest(visitorController.deleteVisitor))
    .put(processRequest(visitorController.updateVisitor));

module.exports = router;
