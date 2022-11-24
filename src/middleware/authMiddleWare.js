const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(403).json({ error: "UNAUTHORIZED REQUEST" });
    }

    const verify = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await prisma.findUnique({
      where: {
        id: verify.id,
      },
    });

    next();
  } catch (error) {
    return res.status(403).json({ error: "UNAUTHORIZED REQUEST" });
  }
};
