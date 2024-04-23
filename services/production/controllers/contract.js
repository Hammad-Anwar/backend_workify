const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  async getContracts(req, res) {
    try {
      const data = await prisma.contract.findMany({});
      res.status(200).json({
        data,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // GET
  async getContractsByProposalIds(req, res) {
    try {
      const { proposalIds } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const contracts = await prisma.contract.findMany({
          where: {
            proposal_id: {
              in: proposalIds,
            },
          },
          include: {
            proposal: {
              include: {
                user_account: true,
                payment: true,
                has_proposal_task: {
                  include: {
                    task: true,
                  },
                },
                job: {
                  include: {
                    task: true,
                  },
                },
              },
            },
          },
        });
        res.status(200).json({
          status: 200,
          data: contracts,
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
