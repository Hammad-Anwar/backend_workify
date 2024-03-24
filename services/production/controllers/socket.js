const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const fcm = require('../helpers/fcm');

exports = module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
        console.log("Connected")
		socket.on("join-room_and_send-message", async (data) => {
			console.log(data)
			const { client_id, freelancer_id, msg_text, job_id } = data;
			// Create a new chatroom
			const newChatroom = await prisma.chatroom.create({
				data: {
					client_id: client_id,
					freelancer_id: freelancer_id,
					job_id: job_id
				}
			});

			// Create a new message
			const newMessage = await prisma.message.create({
				data: {
					freelancer_id: freelancer_id,
					client_id: client_id,
					chatroom_id: newChatroom.chatroom_id,
					msg_text: msg_text
				}
			});

			socket.join(newChatroom.chatroom_id.toString());
			socket.to(newChatroom.chatroom_id.toString()).emit('message', newMessage);
		});

		socket.on("join-room", async (data) => {
			console.log("working join-room")
			const { userId1, userId2 } = data;
			
			// Find the chatroom
			const chatroom = await prisma.chatroom.findFirst({
				where: {
					AND: [
						{ client_id: userId1 },
						{ freelancer_id: userId2 }
					]
				}
			});

			if (chatroom) {
				socket.join(chatroom.chatroom_id.toString());
			}
		});

		// body will be filename with extension (client will receive file name as response after uploading it)
		socket.on("send-message", async (data) => {
			// const { user, chatroom_id, msg_text, isFile, isImage } = data;
			console.log("working send-message")
			const { user, chatroom_id, msg_text } = data;
 
			// Create a new message
			const newMessage = await prisma.message.create({
				data: { 
					freelancer_id: user,
					client_id: user,
					chatroom_id: chatroom_id, 
					msg_text: msg_text
				}
			});

			// Find the chatroom for push notification
			const chatroomForPushNot = await prisma.chatroom.findUnique({
				where: {
					chatroom_id: chatroom_id
				},
				include: {
					client: true,
					freelancer: true
				}
			});

			const deviceToken = chatroomForPushNot.client_id !== user ? chatroomForPushNot.client.deviceToken : chatroomForPushNot.freelancer.deviceToken;

			// if (deviceToken) fcm.sendNotification(message, [deviceToken]);

			socket.to(chatroom_id.toString()).emit('message', newMessage);
		});

		socket.on("typing", async (chatroom_id) => {
			console.log("working typing")
			socket.to(chatroom_id.toString()).emit('typing', "typing");
		});
	});
}
