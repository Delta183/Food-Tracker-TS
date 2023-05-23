import express from "express";

// This effectively add as an observer
const app = express();

// Port is effectively a connection point for the observer
// React uses 3000 by default hence the need for using another port
const port = 4000;

// An error function of sorts, a null case
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log("Server running on port: " + port);
});