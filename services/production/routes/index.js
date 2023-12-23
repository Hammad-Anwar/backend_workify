var express = require("express");
const users = require("../controllers/users");
const { json } = require("express/lib/response");
const freelancerUser = require("../controllers/freelancerUser");
const clientUser = require("../controllers/clientUser");
var router = express.Router();

//User account Routes 
router.get("/users", (req, res) => users.getUsers(req, res));
router.get("/user", (req, res) => users.getUser(req, res));
router.post("/user", (req, res) => users.addUser(req, res));
router.put("/user", (req, res) => users.updateUser(req, res));
router.delete("/user", (req, res) => users.deleteUser(req, res));
router.get("/userLogin", (req, res) => users.getUserLogin(req, res));
router.get("/usersByFreelancers", (req, res) => users.getUsersByFreelancers(req, res));

// Freelancer Routes
router.get("/freelancerUsers", (req, res) => freelancerUser.getFreelancerUsers(req, res));
router.get("/freelancerUser", (req, res) => freelancerUser.getFreelancerUser(req, res));
router.post("/freelancerUser", (req, res) => freelancerUser.addFreelancerUser(req, res));
router.put("/freelancerUser", (req, res) => freelancerUser.updateFreelancerUser(req, res));
router.delete("/freelancerUser", (req, res) => freelancerUser.deleteFreelancerUser(req, res));
router.get("/freelancerByUsers", (req, res) => freelancerUser.getFreelancersByUsers(req, res));
router.get("/freelancerBySkills", (req, res) => freelancerUser.getFreelancersBySkills(req, res));

// Client Routes
router.get("/clientUsers", (req, res) => clientUser.getClientUsers(req, res));
router.get("/clientUser", (req, res) => clientUser.getClientUser(req, res));
router.post("/clientUser", (req, res) => clientUser.addClientUser(req, res));
router.put("/clientUser", (req, res) => clientUser.updateClientUser(req, res));
router.delete("/clientUser", (req, res) => clientUser.deleteClientUser(req, res));
router.get("/clientByUsers", (req, res) => clientUser.getClientByUsers(req, res));

//Test
router.get('/test',  (req, res) => res.status(200).json('Docker is working'));
module.exports = router;
