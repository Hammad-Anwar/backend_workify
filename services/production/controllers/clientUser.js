const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // GET 
  async getClientUsers(req, res) {
    try {
      const client = await prisma.client.findMany({});
      res.status(200).json({
        data: client,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
  // GET SINGLE User data
  async getClientUser(req, res) {
    const { client_id } = req.query;
    if (client_id) {
      try {
        const client = await prisma.client.findUnique({
          where: {
            client_id: Number(client_id),
          },
        });
        res.status(200).json({
          data: client,
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
  
  // POST 
  async addClientUser(req, res) {
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
        await prisma.client.create({
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
  async updateClientUser(req, res) {
    const { client_id, user_password, first_name, last_name, gender, image } =
      req.body;
    if (client_id) {
      try {
        const client = await prisma.client.update({
          where: {
            client_id: client_id,
          },
          data: {
            client_password,
            first_name,
            last_name,
            gender,
            image,
          },
        });
        res.status(200).json({
          message: "Data Update Successfully",
          data: client,
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
  async deleteClientUser(req, res) {
    const { client_id } = req.body;
    if (client_id) {
      try {
        await prisma.client.delete({
          where: {
            client_id: Number(client_id),
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

  // GET User as Client
  async getClientByUsers(req, res) {
    try {
      const clients = await prisma.client.findMany({
        include: {
          user_account: true,
        },
      });
      res.status(200).json({
        data: clients,
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
