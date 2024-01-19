const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  // GET User account table data
  async getUsers(req, res) {
    try {
      const user_accounts = await prisma.user_account.findMany({});
      res.status(200).json({
        data: user_accounts,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // GET SINGLE User data without token
  async getUser(req, res) {
    try {
      const { user_id } = req.query;
      if (validator.isEmpty(user_id.toString()) || !user_id)
        return res.status(400).send({ message: "Please provide all fields " });
      const user = await prisma.user_account.findUnique({
        where: {
          user_id: Number(user_id),
        },
        include: {
          freelancer: true,
          client: true,
        },
      });
      res.status(200).json({
        status: 200,
        data: user,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  

  // ADD USER POST
  async addUser(req, res) {
    try {
      const { user_id, image, userData } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(image) || validator.isEmpty(user_id.toString())) {
          return res.status(400).send({ message: "Please provide all fields" });
        }

        const existsUser = await prisma.user_account.findUnique({
          where: { user_id: user_id },
          include: {
            role: true,
          },
        });

        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const {
              overview,
              experience,
              provider,
              description,
              links,
              location,
            } = userData;

            const freelancerData = await prisma.freelancer.create({
              data: {
                overview,
                experience,
                provider,
                description,
                links,
                location,
                user_account: {
                  connect: {
                    user_id: existsUser.user_id,
                  },
                },
              },
              include: {
                user_account: true,
              }
            });

            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                image, // assuming 'image' is the Base64-encoded image string
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data added successfully in freelancer user",
              data: freelancerData,
            });
          } else if (existsUser.role.name === "client") {
            const { overview, location } = userData;

            const clientData = await prisma.client.create({
              data: {
                overview,
                location,
                user_account: {
                  connect: {
                    user_id: existsUser.user_id,
                  },
                },
              },
              include: {
                user_account: true,
              }
            });

            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                image, // assuming 'image' is the Base64-encoded image string
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data added successfully in client user",
              data: clientData,
            });
          }
        } else {
          return res
            .status(404)
            .send({ status: 404, message: " User is not found!!!" });
        }
      } else {
        return resUser
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // POST Add skills for freelancer
  async addSkills(req, res) {
    try {
      const { user_id, has_skills } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        const freelancerExists = await prisma.freelancer.findFirst({
          where: {
            useraccount_id: Number(user_id),
          },
        });

        if (freelancerExists) {
          const skillCategoryData = has_skills.map(({ skill_id }) => ({
            skill_id,
            freelancer_id: freelancerExists.freelancer_id,
          }));

          const skillsCat = await prisma.has_skill.createMany({
            data: skillCategoryData,
          });

          res.status(200).json({
            status: 200,
            message: "Skills added successfully for freelancer",
            data: skillCategoryData,
          });
        } else {
          return res
            .status(404)
            .send({ status: 404, data: "Freelancer not found" });
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

  // PUT Update both users info
  async updateUser(req, res) {
    try {
      const { user_id, image, userData } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(user_id.toString()) || validator.isEmpty(image)) {
          return res.status(400).send({ message: "Please provide all fields" });
        }

        const existsUser = await prisma.user_account.findUnique({
          where: { user_id: user_id },
          include: {
            role: true,
          },
        });

        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const {
              overview,
              experience,
              provider,
              description,
              links,
              location,
            } = userData;

            const id = await prisma.freelancer.findFirst({
              where: {
                useraccount_id: user_id,
              },
            });

            const freelancerData = await prisma.freelancer.update({
              where: {
                freelancer_id: Number(id.freelancer_id),
              },
              data: {
                overview,
                experience,
                provider,
                description,
                links,
                location,
              },
            });
            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                image, // assuming 'image' is the Base64-encoded image string
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data update successfully in freelancer user",
              data: freelancerData,
            });
          } else if (existsUser.role.name === "client") {
            const { overview, location } = userData;

            const id = await prisma.client.findFirst({
              where: {
                useraccount_id: user_id,
              },
            });

            const clientData = await prisma.client.update({
              where: {
                client_id: Number(id.client_id),
              },
              data: {
                overview,
                location,
              },
            });

            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                image, // assuming 'image' is the Base64-encoded image string
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data update successfully in client user",
              data: clientData,
            });
          }
        } else {
          return res
            .status(404)
            .send({ status: 404, message: "User is not found!!!" });
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

 
  // DELETE User
  async deleteUser(req, res) {
    try {
      const { user_id } = req.query;
      if (validator.isEmpty(user_id.toString())) {
        return res.status(400).send({ message: "Please provide all fields" });
      }
      await prisma.user_account.delete({
        where: {
          user_id: Number(user_id),
        },
      });
      res.status(200).json({
        message: "Data Delete Successfully",
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
};
