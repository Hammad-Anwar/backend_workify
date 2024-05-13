const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  // GET User account table data
  async getAllUsers(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        const user_accounts = await prisma.user_account.findMany({
          include: {
            role: true,
          },
        });
        res.status(200).json({
          data: user_accounts,
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
  // GET SINGLE User data
  async getSingleUserById(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const user = await prisma.user_account.findFirst({
          where: {
            user_id: Number(id),
          },
          include: {
            freelancer: true,
            client: true,
            role: true,
          },
        });
        res.status(200).json({
          status: 200,
          data: user,
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
};
