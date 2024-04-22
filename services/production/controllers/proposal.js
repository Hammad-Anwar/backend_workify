const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  async getProposals(req, res) {
    try {
      const data = await prisma.proposal.findMany({});
      res.status(200).json({
        data,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // GET
  async getReceivedProposals(req, res) {
    try {
      const { useraccount_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(useraccount_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const existsUser = await prisma.user_account.findUnique({
          where: {
            user_id: Number(useraccount_id),
          },
          include: {
            role: true,
          },
        });
        console.log(existsUser.role.name);
        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const freelancer = await prisma.freelancer.findFirst({
              where: {
                useraccount_id: Number(useraccount_id),
              },
            });
            const post = await prisma.job.findMany({
              where: {
                freelancer_id: Number(freelancer.freelancer_id),
              },
              select: {
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
            // The flatMap method is used to map and flatten the nested arrays into a single-level array.
            const proposalData = post.flatMap((job) => job.proposal);
            res.status(200).json({
              status: 200,
              data: proposalData,
            });
          } else if (existsUser.role.name === "client") {
            const client = await prisma.client.findFirst({
              where: {
                useraccount_id: Number(useraccount_id),
              },
            });
            const post = await prisma.job.findMany({
              where: {
                client_id: Number(client.client_id),
              },
              select: {
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
            const proposalData = post.flatMap((job) => job.proposal);
            res.status(200).json({
              status: 200,
              data: proposalData,
            });
          }
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // GET Proposal data by user Id
  async getProposalByUserId(req, res) {
    try {
      const { useraccount_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(useraccount_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.proposal.findMany({
          where: {
            useraccount_id: Number(useraccount_id),
          },
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

  // POST
  async addProposal(req, res) {
    try {
      const {
        useraccount_id,
        job_id,
        description,
        revisions,
        duration,
        payment,
        selectedTasks,
      } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(useraccount_id.toString()) ||
          validator.isEmpty(job_id.toString()) ||
          validator.isEmpty(description) ||
          validator.isEmpty(revisions.toString()) ||
          validator.isEmpty(duration.toString()) ||
          validator.isEmpty(payment.toString())
        )
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.proposal.create({
          data: {
            user_account: {
              connect: {
                user_id: Number(useraccount_id),
              },
            },
            job: {
              connect: {
                job_id: Number(job_id),
              },
            },
            description,
            revisions,
            duration,
            payment: {
              create: {
                payment_amount: parseFloat(payment),
              },
            },
          },
          include: {
            has_proposal_task: true,
          },
        });
        if (selectedTasks.length === 0) {
          res.status(200).json({
            status: 200,
            message: "Proposal Send Successfully",
            data: data,
          });
        } else {
          const proposal_id = Number(data.proposal_id);
          const tasks = await Promise.all(
            selectedTasks.map((task_id) => {
              return prisma.has_proposal_task.create({
                data: {
                  task: {
                    connect: { task_id },
                  },
                  proposal: {
                    connect: { proposal_id },
                  },
                },
                include: {
                  proposal: true,
                  task: true,
                },
              });
            })
          );
          const taskData = await prisma.proposal.findFirst({
            where: {
              proposal_id: Number(tasks[0].proposal_id),
            },
            include: {
              has_proposal_task: true,
            },
          });
          res.status(200).json({
            status: 200,
            message: "Proposal Send Successfully with selected Tasks",
            data: taskData,
          });
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // PUT Update Status info
  async updateProposalStatus(req, res) {
    try {
      const { proposal_id, proposal_status } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(proposal_id.toString())) {
          return res.status(400).send({ message: "Please provide all fields" });
        }

        const data = await prisma.proposal.update({
          where: {
            proposal_id,
          },
          data: {
            proposal_status,
          },
        });

        res.status(200).json({
          status: 200,
          message: "Data update successfully",
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
};
