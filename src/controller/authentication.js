const User = require("../model/User");
const { comparePassword, hashPassword } = require('../utils/utils');
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../service/jwt.service');
const { configuration } = require('../config/config');
const {
    v4: uuidv4,
} = require('uuid');
const { sendEmail } = require('../service/email');
const logger = require("../logger")

exports.register = async (request, response) => {
    try {



        const { password, email, name, role } = request.body

        // check user alredy exist or not...
        const findUser = await User.findOne({ email }).lean();

        if (findUser) {

            return response.status(400).json({
                success: false,
                message: "Email already exist",
            })
        }




        request.body.password = await hashPassword(password);
        const newUser = new User(request.body);
        const user = await newUser.save();

        return response.status(201).json({
            success: true,
            message: "Register Successfully",
            data: user,
        })

    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.login = async (request, response) => {
    try {
        logger()

        const { email, password } = request.body;


        // check user alredy exist or not...
        const findUser = await User.findOne({ email }).lean();

        if (!findUser) {

            return response.status(400).json({
                success: false,
                message: "Please login with correct credentials.",
            })
        }


        // compare password...
        const isPasswordValid = await comparePassword(password, findUser.password);
        if (!isPasswordValid) {
            return response.status(400).json({
                success: false,
                message: "Please login with correct credentials.",
            })
        }



        // generate jwt token...
        const accessToken = await generateJwtToken({ _id: findUser._id });


        return response.status(200).json({
            success: true,
            message: "Login Successfully",
            accessToken,
        })

    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.forgotPassword = async (request, response) => {
    try {
        const { email } = request.body;

        // check user alredy exist or not...
        const user = await User.findOne({ email }).lean();

        if (!user) {

            return response.status(404).json({
                success: false,
                message: "Email not found.",
            })
        }


        //generate token for reset password...
        const token = uuidv4()
        await User.findOneAndUpdate({ _id: user._id }, { forgotPasswordToken: token })

        // send reset password link on user email...
        let url = `https://bookstore.in/reset-password/email=${email}&token=${token}`
        let emailBody = `Reset your password with this link ${url}.`
        await sendEmail(email, "Reset password link", emailBody)

        return response.status(200).json({
            success: true,
            message: "Reset Password link sent on your email.",
        })




    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

exports.resetPassword = async (request, response) => {
    try {
        const { email, token, newPassword } = request.body;

        // check user alredy exist or not...
        const user = await User.findOne({ email }).lean();

        if (!user) {

            return response.status(404).json({
                success: false,
                message: "Email not found.",
            })
        }


        // verify otp...
        if (user.forgotPasswordToken !== token) {
            return response.status(400).json({
                success: false,
                message: "Invalid details.",
            })
        }

        // hash new password...
        const newHashPassword = await hashPassword(newPassword);

        //update new password
        await User.findOneAndUpdate({ _id: user._id }, { password: newHashPassword, forgotPasswordToken: null })

        // // logout from other device ...
        // await UserSession.findOneAndDelete({ userId: user._id });

        return response.status(200).json({
            success: true,
            message: "Password reset successfully.",
        })




    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

