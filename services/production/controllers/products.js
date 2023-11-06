const { PrismaClient, Prisma } = require("@prisma/client");
const res = require("express/lib/response");
const prisma = new PrismaClient();

module.exports = {
  async addProduct(req, res) {
    const { product_name, product_price, category_name, brand_name } = req.body;
    if (product_name || product_price || category_name || brand_name) {
      try {
        await prisma.products.create({
          data: {
            product_name,
            product_price,
            category_name,
            brand_name,
          },
        });
        res.status(200).json({ message: "Data add successfully" });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({ message: e.meta.cause });
        }
      }
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  },
  //GET
  async getProduct(req, res) {
    try {
      const product = await prisma.products.findMany({});
     
      res.status(200).json({ data: product });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ message: e.meta.cause });
      }
    }
  },

  //GET SINGLE
  async getSignalProduct(req, res) {
    const { product_id } = req.query;
    if (product_id) {
      try {
        const product = await prisma.products.findMany({
          where: {
            product_id: Number(product_id),
          },
        });
        res.status(200).json({ data: product });
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
};
