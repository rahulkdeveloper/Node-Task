const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = Number(process.env.PORT) || 6000;
const { dbConnection } = require('./db/conn');
dbConnection();
const morgan = require('morgan');
const logger = require('./config/logger');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));



app.get('/', async (request, response) => {
    response.send("hello world")
})

const authRouter = require('./router/authentication');
const userRouter = require('./router/user');
const adminRouter = require('./router/admin');
const bookRouter = require("./router/books");
const orderRouter = require("./router/order");

app.use("/api/authentication", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/books", bookRouter);
app.use("/api/order", orderRouter);


app.use((err, request, response, next) => {
    console.log("err", err);
    return response.status(400).json({
        success: false,
        message: err.message
    })
})


app.listen(port, () => {
    console.log(`server is runnig on port ${port}`);
})