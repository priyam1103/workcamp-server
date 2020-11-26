const express = require("express");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use("/api/auth", require("../routes/auth"));
    app.use("/api/workcamp", require("../routes/camps"));
}