const express = require("express");
const cors = require("cors");
const contactsRoute = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    // res.json({ message: "Welcome to contact book application backend." });
    res.send("Welcome to contact book application backend.");
});

// route example for error handling
app.get("/error", (req, res, next) => {
    const err = new Error;
    return next(err);
});

// Routes
app.use("/api/contacts", contactsRoute);

// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not Found"));
});

// handle all errors
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});
module.exports = app;