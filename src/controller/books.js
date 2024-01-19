const Books = require("../model/Books");
const { Roles, AddedBookStatus } = require("../config/constant");
const User = require("../model/User");
const { sendEmail } = require("../service/email")

exports.addBook = async (request, response) => {
    try {

        let { publishedDate, title, author, price, genre, description, quantity } = request.body;
        const userData = request.userData

        if (publishedDate > new Date()) {
            return response.status(400).json({
                success: false,
                message: "Invalid publishedDate."
            })
        }

        const bookDetails = {
            title,
            author,
            genre,
            description,
            publishedDate,
            quantity,
            price,
            addedBy: userData._id
        }


        let newBook = new Books(bookDetails);
        let saveBook = await newBook.save();

        // send email to superadmin...
        const superadmin = await User.findOne({ role: Roles.superadmin }, { email: true }).lean();


        let emailBody = `New book added by userEmail- ${request.userData.email}. Book name is ${title}.`
        await sendEmail(superadmin.email, "New book Added", emailBody)


        return response.status(201).json({
            success: true,
            message: "success",
            data: saveBook
        })


    } catch (error) {
        console.log(error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

exports.loadBooks = async (request, response) => {
    try {
        const userData = request.userData;
        let { status, limit, skip } = request.query;

        limit = limit || 10
        skip = skip ?? 0

        const roles = [Roles.admin, Roles.superadmin]

        let findQuery = {
            ...(roles.includes(userData.role) && status && { status: status.toLowerCase() }),
            ...(userData.role === Roles.admin && { addedBy: userData._id }),
            ...(userData.role === "user" && { active: true }),
        }

        // let {brandId} = request.body;
        let books = await Books.find(findQuery).populate('addedBy', 'email name').limit(limit).skip(skip).lean();
        if (books.length === 0) {
            return response.status(200).json({
                success: true,
                message: "Not found.",
                data: []
            })
        }
        let count = await Books.countDocuments(findQuery)
        return response.status(200).json({
            success: true,
            message: "success",
            data: books,
            count
        })






    } catch (error) {
        console.log(error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}
exports.loadById = async (request, response) => {
    try {

        let { id } = request.params;
        if (!id) {
            return response.status(400).json({
                success: false,
                message: "Invalid Request",
                data: []
            })
        }
        let result = await Books.findOne({ _id: id }).populate('addedBy', 'email name').lean();


        if (!result) {
            return response.status(404).json({
                success: true,
                message: "Not found",
                data: []
            })
        }
        return response.status(200).json({
            success: true,
            message: "success",
            data: result
        })


    } catch (error) {
        console.log("err", error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

exports.update = async (request, response) => {
    try {
        const userData = request.userData;

        let { bookId, fields } = request.body;


        // find book...
        const book = await Books.findOne({ _id: bookId }).lean();
        if (!book) {
            return response.status(404).json({
                success: false,
                message: "Not found",
                data: []
            })
        }
        if (book.addedBy.toString() !== userData._id.toString()) {
            return response.status(403).json({
                success: false,
                message: "Access Denied.",
            })
        }

        const updatedBook = await Books.findByIdAndUpdate({ _id: bookId }, fields, { new: true });

        let emailBody = `BookId ${bookId} is updated by userEmail- ${request.userData.email}.`
        await sendEmail(superadmin.email, "Update Book", emailBody)


        return response.status(200).json({
            success: true,
            message: "Book details updated succesfully",
            data: updatedBook
        })




    } catch (error) {
        console.log(error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}


exports.updateBookStatus = async (request, response) => {
    try {

        let { bookId, status } = request.body;
        status = status.toLowerCase();


        // find book...
        const book = await Books.findOne({ _id: bookId }).populate('addedBy', 'email').lean();
        if (!book) {
            return response.status(404).json({
                success: false,
                message: "Not found",
                data: []
            })
        }
        let updateQuery = {
            ...(status === AddedBookStatus.approved && { status, active: true }),
            ...(status === AddedBookStatus.rejected && { status, active: false })
        }

        const updatedBook = await Books.findByIdAndUpdate({ _id: bookId }, updateQuery, { new: true })

        if (status === AddedBookStatus.rejected) {
            // send email to admin which added book.

            let emailBody = `Your book - {BookId - ${bookId}} rejected by Superadmin `
            await sendEmail(book.addedBy.email, "Update Book", emailBody)
        }


        return response.status(200).json({
            success: true,
            message: "Book details updated succesfully",
            data: updatedBook
        })




    } catch (error) {
        console.log(error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteBook = async (request, response) => {
    try {

        const userData = request.userData;

        let { bookId } = request.params;

        if (!bookId) {
            return response.status(400).json({
                success: false,
                message: "Invalid Request",
            })
        }

        // find book...
        const book = await Books.findOne({ _id: bookId }).lean();
        if (!book) {
            return response.status(404).json({
                success: false,
                message: "Not found",
                data: []
            })
        }
        if (book.addedBy.toString() !== userData._id.toString()) {
            return response.status(403).json({
                success: false,
                message: "Access Denied.",
            })
        }
        await Books.findByIdAndDelete({ _id: bookId })


        return response.status(200).json({
            success: true,
            message: "Book deleted succesfully.",
        })

    } catch (error) {
        console.log(error)
        return response.status(error.status || 500).json({
            success: false,
            message: error.message
        })
    }
}