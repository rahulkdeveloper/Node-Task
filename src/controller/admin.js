const User = require("../model/User");
const { generatePassword, hashPassword } = require('../utils/utils');
const Books = require("../model/Books");
const { sendEmail } = require('../service/email')

exports.createUser = async (request, response) => {
    try {

        const { name, email, role } = request.body;

        // check user alredy exist or not...
        const findUser = await User.findOne({ email }).lean();

        if (findUser) {

            return response.status(409).json({
                success: false,
                message: "Email already exist.",
            })
        }

        //create password for user...
        const password = await generatePassword(8);
        console.log(password);
        const hashPass = await hashPassword(password);
        request.body.password = hashPass;

        const newUser = new User(request.body);
        const saveUser = await newUser.save();

        // send email to user...
        let emailBody = `Hello ${name} login with this email - ${saveUser.email} and password ${password} on bookstore.in`
        await sendEmail(saveUser.email, "BookStore credentials", emailBody)

        return response.status(201).json({
            success: true,
            message: `New ${role} created successfully.`,
            data: saveUser,
        })


    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}