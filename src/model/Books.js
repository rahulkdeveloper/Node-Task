const mongoose = require('mongoose');
const { Schema } = require('mongoose')

const BooksSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number
    },

    addedBy: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "reject"],
        default: "pending"
    },
    active: {
        type: Boolean,
        default: false
    }

},

    {
        timestamps: true
    }
)

const Books = new mongoose.model("Books", BooksSchema);

module.exports = Books;