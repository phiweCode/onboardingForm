const {
    errorMessages
} = require("../utils/utils.js");


const processRequest = (handler, successStatus = 200) => async (req, res, next) => {

    const createResponseObj = (response) => {
        if (['PUT', 'DELETE'].some(method => req.method === method) && successStatus >= 200 && successStatus <= 299)
            res.status(successStatus).json({
                status: "success",
                message: response
            });
        else res.status(successStatus).json({
            status: "success",
            data: response
        })
    }

    try {
        const response = await handler(req);

        if (req.url === '/thank_you') res.render('thank_you', {
            results: response
        })
        else if (req.url === '/new_visitor') res.sendFile(response)
        else createResponseObj(response)

    } catch (error) {
        if (error.message === errorMessages.NO_DATA_PROVIDED || error.message.startsWith('Invalid input from')) {
            error.statusCode = 400;
        } else if (req.params.id && error.message === errorMessages.nonExistentVisitor(parseInt(req.params.id))) {
            error.statusCode = 404;
        } else if (error.message === errorMessages.UPDATES) {
            error.statusCode = 400
        }
        if (req.url === '/thank_you') {
            res.status(error.statusCode || 500).render('error', {
                error: error.message
            });
        } else {
            next(error);
        }
    }
};

module.exports = processRequest