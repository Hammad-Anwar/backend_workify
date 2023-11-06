var express = require("express");
const customers = require("../controllers/customers");
const products = require("../controllers/products");
var router = express.Router();

/* GET home page. */
router.post("/customer", (req, res) => customers.addCustomer(req, res));
router.get("/customers", (req, res) => customers.getCustomers(req, res));
router.get("/customer", (req, res) => customers.getSingleCustomer(req, res));
router.delete("/customer", (req, res) => customers.deleteCustomer(req, res));
router.put("/customer", (req, res) => customers.updateCustomer(req, res));

//Product Page
router.post("/product", (req, res) => products.addProduct(req, res));
router.get("/product", (req, res) => products.getProduct(req, res));
module.exports = router;
