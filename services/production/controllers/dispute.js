const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  // GET User account table data
  async getDisputes(req, res) {
    try {
      const data = await prisma.dispute.findMany({});
      res.status(200).json({
        data,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET Active dispute data by user Id
  async getActiveDispute(req, res) {
    try {
      const { useraccount_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(useraccount_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.findMany({
          where: {
            useraccount_id: Number(useraccount_id),
            status: "active",
          },
        });
        res.status(200).json({
          status: 200,
          data: data,
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

  // GET Closed dispute data by user Id
  async getClosedDispute(req, res) {
    try {
      const { useraccount_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(useraccount_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.findMany({
          where: {
            useraccount_id: Number(useraccount_id),
            status: "closed",
          },
        });
        res.status(200).json({
          status: 200,
          data: data,
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

  // GET each dispute all complains data by dispute Id
  async getDisputeComplains(req, res) {
    try {
      const { dispute_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(dispute_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.findFirst({
          where: {
            dispute_id: Number(dispute_id),
          },
          include: {
            dispute_complains: true,
          },
        });
        res.status(200).json({
          status: 200,
          data: data,
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
  // POST Add New dispute by User
  async addDispute(req, res) {
    try {
      const { useraccount_id, complain_title, complain_msg, complain_img } =
        req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(useraccount_id.toString()) ||
          validator.isEmpty(complain_title) ||
          validator.isEmpty(complain_msg) 
        )
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.create({
          data: {
            useraccount_id,
            complain_title,
            complain_msg,
            complain_img,
          },
        });
        res.status(200).json({
          status: 200,
          message: "Dispute Submit Successfully",
          data: data,
        });
      } else {
        return resUser
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // POST Add dispute Complains by User both user's
  async addDisputeComplains(req, res) {
    try {
      const { dispute_id, useraccount_id, complain_msg } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(useraccount_id.toString()) ||
          validator.isEmpty(dispute_id.toString()) ||
          validator.isEmpty(complain_msg)
        )
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute_complains.create({
          data: {
            useraccount_id,
            dispute_id,
            complain_msg,
          },
        });
        res.status(200).json({
          status: 200,
          message: "Complain Send Successfully",
          data: data,
        });
      } else {
        return resUser
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
};
