var express = require("express");
// const customers = require("../controllers/customers");
// const products = require("../controllers/products");

const users = require("../controllers/users");
const { json } = require("express/lib/response");
var router = express.Router();

/* GET home page. */
// router.post("/customer", (req, res) => customers.addCustomer(req, res));
// router.get("/customers", (req, res) => customers.getCustomers(req, res));
// router.get("/customer", (req, res) => customers.getSingleCustomer(req, res));
// router.delete("/customer", (req, res) => customers.deleteCustomer(req, res));
// router.put("/customer", (req, res) => customers.updateCustomer(req, res));

// //Product Page 
// router.post("/product", (req, res) => products.addProduct(req, res));
// router.get("/products", (req, res) => products.getProduct(req, res));

//User account Page
router.post("/user", (req, res) => users.addUser(req, res));
router.get("/users", (req, res) => users.getUser(req, res));

// Freelancer
router.get("/freelancerUsers", (req, res) => users.getFreelancerUser(req, res));
// Client
router.get("/clientUsers", (req, res) => users.getClientUser(req, res));

//Test
router.get('/test',  (req, res) => res.status(200).json('Docker is working'));
module.exports = router;
