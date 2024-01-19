const Joi = require("joi");

const middlewareValidation = (schema, property) => {
    return (request, response, next) => {


        const { error } = schema.validate(request.body, { abortEarly: false })

        if (error == null) {
            next()
        }
        else {
            const { details } = error;
            response.status(400).json({
                success: false,
                message: details
            })
        }
    }
}

const schemas = {
    registerBody: Joi.object().keys({
        name: Joi.string().trim().required().min(3).max(20).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().required().min(6).max(30),
    })
        .unknown(true),
    loginBody: Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().required().min(6).max(30),
    })
        .unknown(true),
    createUser: Joi.object().keys({
        name: Joi.string().trim().required().min(3).max(20).required(),
        email: Joi.string().trim().email().required(),
        role: Joi.string().valid('admin', 'user'),
    }),
    forgotPasswordBody: Joi.object().keys({
        email: Joi.string().trim().email().required(),
    })
        .unknown(true),
    resetPasswordBody: Joi.object().keys({
        email: Joi.string().trim().email().required(),
        token: Joi.string().required(),
        newPassword: Joi.string().required().min(6).max(30),
    })
        .unknown(true),
    updateBookStatus: Joi.object().keys({
        bookId: Joi.string().required(),
        status: Joi.string().valid('approved', 'rejected'),
    }),

    addBook: Joi.object().keys({
        publishedDate: Joi.date().required(),
        title: Joi.string().trim().required().min(3).max(50),
        genre: Joi.string().trim().required().min(3).max(50),
        description: Joi.string().trim().required().min(3).max(100),
        author: Joi.string().trim().required().min(3).max(50),
        price: Joi.number().required(),
        quantity: Joi.number().required()
    })
        .unknown(true),
    updateBook: Joi.object().keys({
        bookId: Joi.string().required(),
        fields: Joi.object().keys({
            publishedDate: Joi.date().required(),
            title: Joi.string().trim().required().min(3).max(50),
            genre: Joi.string().trim().required().min(3).max(50),
            description: Joi.string().trim().required().min(3).max(100),
            author: Joi.string().trim().required().min(3).max(50),
            price: Joi.number().required(),
            quantity: Joi.number().required()
        }).required()
    }),
    createOrder: Joi.object().keys({
        bookId: Joi.string().required(),
        orderTotal: Joi.number().required(),
        quantity: Joi.number().required(),
        paymentMethod: Joi.string().valid('online', 'cod'),
        address: Joi.object().keys({
            street: Joi.string().trim().required().min(3).max(50),
            city: Joi.string().trim().required().min(3).max(50),
            State: Joi.string().trim().required().min(3).max(100),
            pincode: Joi.number().required(),
        }).required()
    }),

}




module.exports = { middlewareValidation, schemas }