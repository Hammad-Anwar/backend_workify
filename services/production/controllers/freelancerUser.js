const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // GET Freelancer users
  async getFreelancerUsers(req, res) {
    try {
      const freelancer = await prisma.freelancer.findMany({});
      res.status(200).json({
        data: freelancer,
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
  async getFreelancerUser(req, res) {
    const { freelancer_id } = req.query;
    if (freelancer_id) {
      try {
        const user = await prisma.freelancer.findUnique({
          where: {
            freelancer_id: Number(freelancer_id),
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

  // POST
  async addFreelancerUser(req, res) {
    const {
      useraccount_id,
      reg_date,
      overview,
      experience,
      provider,
      description,
      links,
      location,
    } = req.body;
    if (
      useraccount_id ||
      reg_date ||
      overview ||
      experience ||
      provider ||
      description ||
      links ||
      location
    ) {
      try {
        await prisma.freelancer.create({
          data: {
            useraccount_id,
            reg_date,
            overview,
            experience,
            provider,
            description,
            links,
            location,
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
  async updateFreelancerUser(req, res) {
    const {
      freelancer_id,
      useraccount_id,
      overview,
      experience,
      provider,
      description,
      links,
      location,
    } = req.body;
    if (freelancer_id) {
      try {
        const freelancer = await prisma.freelancer.update({
          where: {
            freelancer_id: Number(freelancer_id),
          },
          data: {
            useraccount_id,
            overview,
            experience,
            provider,
            description,
            links,
            location,
          },
        });
        res.status(200).json({
          message: "Data Update Successfully",
          data: freelancer,
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
  async deleteFreelancerUser(req, res) {
    const { freelancer_id } = req.body;
    if (freelancer_id) {
      try {
        await prisma.freelancer.delete({
          where: {
            freelancer_id: Number(freelancer_id),
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

  
  // Get freelancer by the users
  async getFreelancersByUsers(req, res) {
    try {
      const dbFreelancerUser = await prisma.freelancer.findMany({
        include: {
          user_account: true,
        },
      });
      res.status(200).json({
        data: dbFreelancerUser,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
  // Get freelancer by the skills 
  async getFreelancersBySkills(req, res) {
    try {
      const data = await prisma.has_skill.findMany({
        include: {
          freelancer: true,
          skill_category: true,
        },
      });
      res.status(200).json({
        data: data,
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
