const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
// POST
  async addUser(req, res) {
    const { user_name, email, user_password, first_name, last_name, gender, image } =
      req.body;
    if (user_name || email || user_password || first_name || last_name || gender || image) {
      try {
        await prisma.user_account.create({
          data: {
            user_name,
            email,
            user_password,
            first_name,
            last_name,
            gender,
            image
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
  async getUser(req, res) {
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
//   // GET SINGLE
//   async getSingleCustomer(req, res) {
//     const { customer_id } = req.query;
//     if (customer_id) {
//       try {
//         const customer = await prisma.customers.findMany({
//           where: {
//             customer_id: Number(customer_id),
//           },
//         });
//         res.status(200).json({
//           data: customer,
//         });
//       } catch (e) {
//         if (e instanceof Prisma.PrismaClientKnownRequestError) {
//           res.status(500).json({
//             message: e.meta.cause,
//           });
//         }
//       }
//     } else {
//       res.status(400).json({ message: "Invalid Request" });
//     }
//   },
};
