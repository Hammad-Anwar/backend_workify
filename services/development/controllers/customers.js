const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
// POST
  async addCustomer(req, res) {
    const { customer_name, customer_email, customer_phone, customer_address } =
      req.body;
    if (customer_name || customer_email || customer_phone || customer_address) {
      try {
        await prisma.customers.create({
          data: {
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
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

  // GET
  async getCustomers(req, res) {
    try {
      const customer = await prisma.customers.findMany({});
      res.status(200).json({
        data: customer,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
  // GET SINGLE
  async getSingleCustomer(req, res) {
    const { customer_id } = req.query;
    if (customer_id) {
      try {
        const customer = await prisma.customers.findMany({
          where: {
            customer_id: Number(customer_id),
          },
        });
        res.status(200).json({
          data: customer,
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
  // PUT
  async updateCustomer(req, res) {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_id,
    } = req.body;
    if (customer_id) {
      try {
        const customer = await prisma.customers.update({
          where: {
            customer_id: customer_id,
          },
          data: {
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
          },
        });
        res.status(200).json({
          message: "Customer Update Successfully",
          data: customer,
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
  async deleteCustomer(req, res) {
    const { customer_id } = req.body;
    if (customer_id) {
      try {
        await prisma.customers.delete({
          where: {
            customer_id: customer_id,
          },
        });
        res.status(200).json({
          message: "Customer Delete Successfully",
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
};
