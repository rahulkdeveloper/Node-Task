const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cod"],
        required: true,
    },
    orderTotal: {
        type: Number,
        required: true,
    },
    address: {
        street: String,
        city: String,
        State: String,
        pincode: Number
    },
    isPaymentCompleted: {
        type: Boolean,
        default: false

    }

});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;