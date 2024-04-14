var express = require("express");
const users = require("../controllers/users");
const { json } = require("express/lib/response");
const post = require("../controllers/post");
const chat = require("../controllers/chat");
const { Server } = require("socket.io");
const savedPost = require("../controllers/savedPost");
const dispute = require("../controllers/dispute");

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
router.get("/skills", (req, res) => users.getSkills(req, res));
router.get("/freelancerSkills", (req, res) => users.getSkillsByFreelancer(req, res));
router.get("/usersMe", (req, res) => users.getUserMe(req, res));

// POst Controller Routes
router.get("/jobs", (req, res) => post.getJobs(req, res));
router.get("/job", (req, res) => post.getJobById(req, res));
router.get("/featuredJobs", (req, res) => post.getFeaturedPosts(req, res));
router.get("/clientJobs", (req, res) => post.getJobUsingClient(req, res));
router.get("/freelancerJobs", (req, res) => post.getJobUsingFreelancer(req, res));
router.get("/skillsJobs", (req, res) => post.getJobUsingSkills(req, res));
router.post("/job", (req, res) => post.addJob(req, res));
router.put("/job", (req, res) => post.updateJob(req, res));
router.delete("/job", (req, res) => post.deleteJob(req, res));

// Chat cotroller Routes 
router.get("/chatrooms", (req, res) => chat.getChatrooms(req, res))
router.post("/chatrooms", (req, res) => chat.addChatroom(req, res))
router.post("/userChatrooms", (req, res) => chat.addUserChatroom(req, res))
router.post("/messages", (req, res) => chat.addMessage(req, res))
router.get("/messages", (req, res) => chat.getMessages(req, res))

// Saved Posts Routes
router.get("/savedPosts", (req, res) => savedPost.getsavedPosts(req, res))
router.get("/savedPostsByUserId", (req, res) => savedPost.getsavedPostsByUserId(req, res))
router.route("/savedPost")
.put((req, res) => savedPost.savedPost(req, res))
.post((req, res) => savedPost.savedPost(req, res));

// Disputes Routes
router.get("/disputes", (req, res) => dispute.getDisputes(req, res))





//Test
router.get('/test',  (req, res) => res.status(200).json('Docker is working'));
module.exports = router;
