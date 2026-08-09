const Thumbnail = require("../models/thumbnail");

const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream");
const util = require("util");
const pipelineAysnc = util.promisify(pipeline);

exports.createThumbnail = async (request, reply) => {
  try {
    const parts = request.part();
    let fields = {};
    let filename;

    for await (const part of parts) {
      if (part.file) {
        const filename = `${Date.now()}-${part.filename}`;
        const saveTo = path.join(
          __dirname,
          "..",
          "uplaods",
          "thumbnails",
          filename,
        );
        await pipelineAysnc(part.file, fs.createWriteStream(saveTo));
      } else {
        fields[part.filename] = part.value;
      }
    }

    const thumbnail = new Thumbnail({
      user: request.user.id,
      videoName: fields.videoName,
      version: fields.version,
      image: `/uploads/thumbnails/${filename}`,
      paid: fields.paid === "true",
    });
    await thumbnail.save();
    reply.send({ message: "Thumbnail created successfully" });
  } catch (error) {
    reply.send(error);
  }
};

exports.getthumbnails = async (request, reply) => {
  try {
    const thumbnails = await Thumbnail.find({ user: request.user.id });
    reply.send(thumbnails);
  } catch (error) {
    reply.send(error);
  }
};

exports.getThumbnail = async (request, reply) => {
  try {
    const thumbnail = await Thumbnail.findOne({
      _id: request.params.id,
      user: request.user.id,
    });
    if (!thumbnail) {
      return reply.notFound({ message: "Thumbnail not found" });
    }
    reply.send(thumbnail);
  } catch (error) {
    reply.send(error);
  }
};

exports.updateThumbnail = async (request, reply) => {
  try {
    const updatedData = request.body;
    await Thumbnail.findOneAndUpdate(
      { _id: request.params.id, user: request.user.id },
      updatedData,
      { new: true },
    );
    if (!thumbnail) {
      return reply.notFound({ message: "Thumbnail not found" });
    }
    reply.send(thumbnail);
  } catch (err) {
    reply.send(err);
  }
};

exports.deleteThumbnails = async (request, reply) => {
  try {
    const thumbnail = await Thumbnail.findByIdAndDelete({
      _id: request.params.id,
      user: request.user.id,
    });
    if (!thumbnail) {
      return reply.notFound({ message: "Thumbnail not found" });
    }
    const filepath = path.join(
      __dirname,
      "..",
      "uplaods",
      "thumbnails",
      path.basename(thumbnail.image),
    );
    fs.unlinkSync(filepath, (err) => {
      if (err) {
        fastify.log.error;
      }
    });
    reply.send({ message: "Thumbnail deleted successfully" });
  } catch (error) {
    reply.send(error);
  }
};

exports.deleteAllThumbnails = async (request, reply) => {
  try {
    const thumbnails = await Thumbnail.find({ user: request.user.id });
    await Thumbnail.deleteMany({ user: request.user.id });
    reply.send({ message: "All thumbnails deleted successfully" });
    for (const thumbnail of thumbnails) {
      const filepath = path.join(
        __dirname,
        "..",
        "uplaods",
        "thumbnails",
        path.basename(thumbnail.image),
      );
      fs.unlinkSync(filepath, (err) => {
        if (err) {
          fastify.log.error;
        }
      });
    }
  } catch (error) {
    reply.send(error);
  }
};
