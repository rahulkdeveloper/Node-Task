const Books = require("../model/Books");
const Order = require("../model/Order");
const {
    v4: uuidv4,
} = require('uuid');
const User = require("../model/User");
const { Roles } = require('../config/constant');
const { sendEmail } = require('../service/email')

exports.buyNow = async (request, response) => {
    try {

        let { bookId, address, paymentMethod, orderTotal, quantity } = request.body;
        const userData = request.userData;

        // find book...
        const book = await Books.findOne({ _id: bookId, active: true }).lean();
        if (!book) {
            return response.status(404).json({
                success: false,
                message: "Book not found.",
            })
        }

        if (book.quantity < quantity) {
            return response.status(400).json({
                success: true,
                message: `Only ${book.quantity} left.`,
            })
        }

        // create order...
        let orderDetails = {
            bookId,
            quantity,
            address,
            paymentMethod,
            orderTotal,
            userId: userData._id,
            orderId: uuidv4()
        }


        if (paymentMethod === "online") {
            orderDetails = { ...orderDetails, isPaymentCompleted: true }
        }

        const newOrder = await Order.create(orderDetails);

        if (paymentMethod === "online") {
            // deduct quantity
            await Books.findByIdAndUpdate({ _id: bookId }, { quantity: (book.quantity - quantity) })
        }

        // send email to superadmin for new order...
        const superadmin = await User.findOne({ role: Roles.superadmin }, { email: true }).lean();

        let emailBody = `New order recevied and orderId ${newOrder.orderId}`
        await sendEmail(superadmin.email, "New Order", emailBody)

        return response.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: newOrder
        })


    } catch (error) {
        console.log(error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}