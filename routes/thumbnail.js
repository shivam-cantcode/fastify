const thumnailController = require("../controller/thumbnailController");

module.exports = async (fastify, opts) => {
  fastify.register(async function (fastify) {
    fastify.addHook("preHandler", fastify.authenticate);

    fastify.post("/", thumnailController.createThumbnail);

    fastify.get("/", thumnailController.getthumbnails);
    fastify.get("/:id", thumnailController.getThumbnail);
    fastify.put("/:id", thumnailController.updateThumbnail);
    fastify.delete("/:id", thumnailController.deleteThumbnail);
    fastify.delete("/", thumnailController.deleteThumbnails);
  });
};
