const express = require("express");
const sellerRouter = express.Router();
const sellerController =
    require("../controllers/sellerController");

sellerRouter.get("/listAllSellers",
    sellerController.listAllSellers);

module.exports = sellerRouter;