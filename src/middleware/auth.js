const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { verifyJwtToken } = require('../service/jwt.service');

exports.auth = (...role) => {
    return async (request, response, next) => {

        try {
            let token = (request.headers.authorization);

            if (!token) {
                return response.status(401).json({
                    success: false,
                    message: "Unauthorized.",
                })
            }



            let userDetails = await verifyJwtToken(token, process.env.JWT_SECRET);



            if (!userDetails) {
                return response.status(403).json({
                    success: false,
                    message: "Access Denied.",
                })
            }

            let userFound = await User.findOne({ _id: userDetails._id }).lean();

            if (!userFound) {
                return response.status(403).json({
                    success: false,
                    message: "Access Denied.",
                })
            }

            if (!role.includes(userFound.role)) {
                return response.status(403).json({
                    success: false,
                    message: "Access Denied.",
                })
            }

            request.userData = { _id: userFound._id, role: userFound.role, email: userFound.email }

            next()

        } catch (error) {

            console.log("Error", error);
            return response.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error"
            })
        }
    }
}