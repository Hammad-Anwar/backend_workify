var express = require("express");
const users = require("../controllers/users");
const { json } = require("express/lib/response");
const post = require("../controllers/post");
var router = express.Router();

//User account Routes 
router.get("/users", (req, res) => users.getUsers(req, res));
router.get("/user", (req, res) => users.getUser(req, res));
router.post("/login", (req, res) => users.login(req, res));
router.post("/signup", (req, res) => users.signUp(req, res));
router.post("/user", (req, res) => users.addUser(req, res));
router.post("/addSkills", (req, res) => users.addSkills(req, res));
router.put("/user", (req, res) => users.updateUser(req, res));
router.put("/updatePassword", (req, res) => users.updatePassword(req, res));
router.delete("/user", (req, res) => users.deleteUser(req, res));


router.get("/users", (req, res) => post.getJobs(req, res));
router.get("/clientJobs", (req, res) => post.getJobUsingClient(req, res));
router.get("/freelancerJobs", (req, res) => post.getJobUsingFreelancer(req, res));
router.get("/skillsJobs", (req, res) => post.getJobUsingSkills(req, res));





//Test
router.get('/test',  (req, res) => res.status(200).json('Docker is working'));
module.exports = router;
