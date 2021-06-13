const express = require("express");
const { searchSalesBySeller } = require("../controllers/saleController");
const saleRouter = express.Router();
const saleController = require("../controllers/saleController");

saleRouter.get("/listAllSales",
    saleController.listAllSales);
saleRouter.post("/searchSalesByDate",
    saleController.searchSalesByDate);
saleRouter.get(
    "/searchSalesBySeller/:sellerId",
    saleController.searchSalesBySeller
);

module.exports = saleRouter;