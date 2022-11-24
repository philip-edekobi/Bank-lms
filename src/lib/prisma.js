const { PrismaClient } = require("@prisma/client");
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;

//the purpose of this file is to ensure that we don't create many prisma instances
// and therefore, many connections to the database
