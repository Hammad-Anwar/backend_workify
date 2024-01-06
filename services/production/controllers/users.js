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
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

  // LOGIN POST
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (validator.isEmpty(email) || validator.isEmpty(password))
        return res.status(400).send({ message: "Please provide all fields " });
      const userFound = await prisma.user_account.findFirst({
        where: {
          email: email,
          password: crypto
            .createHmac("sha256", "secret")
            .update(password)
            .digest("hex"),
        },
        include: {
          role: true,
        },
      });
      if (userFound.role.name == "freelancer") {
        const freelancerUser = await prisma.freelancer.findFirst({
          where: {
            useraccount_id: userFound.user_id,
          },
          include: {
            user_account: true,
          },
        });
        return res.status(200).send({
          status: 200,
          data: generateToken(freelancerUser),
          message: "Freelancer",
        });
      } else if (userFound.role.name == "client") {
        const clientUser = await prisma.client.findFirst({
          where: {
            useraccount_id: userFound.user_id,
          },
          include: {
            user_account: true,
          },
        });
        return res.status(200).send({
          status: 200,
          data: generateToken(clientUser),
          message: "Client",
        });
      }
      return res.status(404).send({ message: "No such user found!" });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET SINGLE User data
  async getUser(req, res) {
    const { user_id } = req.query;
    if (user_id) {
      try {
        const user = await prisma.user_account.findUnique({
          where: {
            user_id: Number(user_id),
          },
        });
        res.status(200).json({
          data: user,
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  },
  // GET User data for login
  // async getUserLogin(req, res) {
  //   const { email, user_password } = req.query;
  //   if (email || user_password) {
  //     console.log(user_name);
  //     try {
  //       const user = await prisma.user_account.findMany({
  //         where: {
  //           email: { contains: String(email) },
  //         },
  //         include: {
  //           client: true,
  //           freelancer: true,
  //         },
  //       });
  //       if (!user) {
  //         return res.status(401).json({ error: "Invalid credentials" });
  //       }
  //       res.status(200).json({
  //         data: user,
  //       });
  //     } catch (e) {
  //       if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //         res.status(500).json({
  //           message: e.meta.cause,
  //         });
  //       }
  //     }
  //   } else {
  //     res.status(400).json({ message: "Invalid Request" });
  //   }
  // },
  // POST user data
  async addUser(req, res) {
    const {
      user_name,
      email,
      user_password,
      first_name,
      last_name,
      gender,
      image,
    } = req.body;
    if (
      user_name ||
      email ||
      user_password ||
      first_name ||
      last_name ||
      gender ||
      image
    ) {
      try {
        await prisma.user_account.create({
          data: {
            user_name,
            email,
            user_password,
            first_name,
            last_name,
            gender,
            image,
          },
        });
        res.status(200).json({ message: "Data add successfully" });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  },


  // PUT
  async updateUser(req, res) {
    const { user_id, user_password, first_name, last_name, gender, image } =
      req.body;
    if (user_id) {
      try {
        const user = await prisma.user_account.update({
          where: {
            user_id: user_id,
          },
          data: {
            user_password,
            first_name,
            last_name,
            gender,
            image,
          },
        });
        res.status(200).json({
          message: "Data Update Successfully",
          data: user,
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else res.status(400).json({ message: "Invalid Request" });
  },
  // DELETE
  async deleteUser(req, res) {
    const { user_id } = req.body;
    if (user_id) {
      try {
        await prisma.user_account.delete({
          where: {
            user_id: user_id,
          },
        });
        res.status(200).json({
          message: "Data Delete Successfully",
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else res.status(400).json({ message: "Invalid Request" });
  },


  
  // Get freelancer with user table
  async getUsersByFreelancers(req, res) {
    try {
      const user_accounts = await prisma.user_account.findMany({
        include: {
          freelancer: true,
        },
      });
      res.status(200).json({
        data: user_accounts,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

  // Get client table as user
  async getUsersByClients(req, res) {
    try {
      const user_accounts = await prisma.user_account.findMany({
        include: {
          client: true,
        },
      });
      res.status(200).json({
        data: user_accounts,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
};
