const User = require("../model/user.js");

const crypto = require("crypto");
const bcrypt = require("bcrypt");

exports.register = async (request, reply) => {
  try {
    const { name, email, password, country } = request.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      country,
    });

    await user.save();
    reply.code(201).send({ message: "User created successfully" });
  } catch (error) {
    reply.send(error);
  }
};

exports.login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    //validate the password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.code(401).send({ message: "Invalid email or password" });
    }

    const token = request.server.jwt.sign({ id: user._id });
    reply.send({ token });
  } catch (error) {
    reply.send(error);
  }
};

exports.forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
      return reply.notFound({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetPasswordExpire;

    await user.save({ validateBeforeSave: false });
    const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`;
    reply.send({ resetUrl });
  } catch (error) {
    reply.send(error);
  }
};

exports.ressetPassword = async (request, reply) => {
  const resetToken = request.param.token;
  const { newPassword } = request.body;

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resestPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return reply.badRequest({ message: "Invalid token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();

  reply.send({ message: "Password reset successfully" });
};

exports.logout = async (request, reply) => {
  reply.send({ message: "User logged out successfully" });
};
