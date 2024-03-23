const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
// const { Server } = require("socket.io");
// const io = new Server(server);
module.exports = {
  async getChatrooms(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const chatrooms = await prisma.chatroom.findMany({
          include: {
            client: true,
            freelancer: true,
            job: true,
            message: {
              include: {
                client: true,
                freelancer: true,
              },
            },
          },
        });
        res.status(200).json({
          status: 200,
          data: chatrooms,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async getMessages(req, res) {
    try {
      const { chatroom_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        
        if (!chatroom_id || isNaN(parseInt(chatroom_id))) {
          return res
            .status(400)
            .send({ message: "Please provide a valid chatroom_id" });
        }
        
        const messages = await prisma.message.findMany({
          where: {
            chatroom_id: parseInt(chatroom_id),
          },
          include: {
            client: true,
            freelancer: true,
            chatroom: true,
          },
        });
        
        res.status(200).json({
          status: 200,
          data: messages,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
},


  // POST Chatroom data
  //   async addChatroom(req, res) {
  //     try {
  //       const { client_id, freelancer_id, job_id } = req.body;
  //       let token = req.headers["authorization"];
  //       if (token) {
  //         token = await verifyToken(token.split(" ")[1]);
  //         if (
  //           validator.isEmpty(client_id.toString()) ||
  //           validator.isEmpty(freelancer_id.toString()) ||
  //           validator.isEmpty(job_id.toString())
  //         )
  //           return res
  //             .status(400)
  //             .send({ message: "Please provide all fields " });
  //         const chatroom = await prisma.chatroom.create({
  //           data: {
  //             client_id,
  //             freelancer_id,
  //             job_id,
  //           },
  //           include: {
  //             client: true,
  //             freelancer: true,
  //             job: true,
  //           },
  //         });
  //         res.status(200).json({
  //           status: 200,
  //           data: chatroom,
  //         });
  //       } else {
  //         return res
  //           .status(401)
  //           .send({ status: 401, data: "Please provide a valid auth token" });
  //       }
  //     } catch (e) {
  //       return res.status(500).json({ status: 500, message: e.message });
  //     }
  //   },

  //   POST message
  //   async addMessage(req, res, io) {
  //     try {
  //       const { freelancer_id, client_id, chatroom_id, msg_text } = req.body;
  //       let token = req.headers["authorization"];
  //       if (token) {
  //         token = await verifyToken(token.split(" ")[1]);
  //         if (
  //           validator.isEmpty(client_id.toString()) ||
  //           validator.isEmpty(freelancer_id.toString()) ||
  //           validator.isEmpty(chatroom_id.toString()) ||
  //           validator.isEmpty(msg_text)
  //         )
  //           return res
  //             .status(400)
  //             .send({ message: "Please provide all fields " });
  //         const message = await prisma.message.create({
  //           data: {
  //             freelancer_id,
  //             client_id,
  //             chatroom_id,
  //             msg_text,
  //           },
  //           include: {
  //             client: true,
  //             freelancer: true,
  //             chatroom: true,
  //           },
  //         });

  //         // Emit new message to all connected clients in the chatroom
  //         io.to(`chatroom-${chatroom_id}`).emit("newMessage", message);

  //         res.json(message);
  //       } else {
  //         return res
  //           .status(401)
  //           .send({ status: 401, data: "Please provide a valid auth token" });
  //       }
  //     } catch (e) {
  //       return res.status(500).json({ status: 500, message: e.message });
  //     }
  //   },
};
