const User = require('../model/User');


exports.loadProfile = async (request, response) => {
    try {
        const userId = request.userData._id

        const userDetails = await User.findOne({ _id: userId }, { password: false }).lean();




        return response.status(200).json({
            success: true,
            message: "success",
            data: userDetails
        })


    } catch (error) {
        console.log("Error", error);
        return response.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}