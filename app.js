const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

const ExpressError = require("./utils/ExpressError.js");



const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("MongoDB Connection Error:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Setup view engine and middlewares
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


//404 handler
app.all("/{*path}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).send(message);
});

// Start server
app.listen(8080, () => {
    console.log(" server is listening to port 8080");
});
