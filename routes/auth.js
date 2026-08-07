const authController = require("../controller/authController");

module.exports = async (fastify, opts) => {
  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);
  fastify.post("/forgot-password", authController.forgotPassword);
  fastify.post("/reset-password/:token", authController.ressetPassword);
  fastify.post(
    "/logout",
    { prehandler: [fastify.authenticate] },
    authController.logout,
  );
};
