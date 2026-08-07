require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

const fastifyEnv = require("@fastify/env");

// Register plugins
fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/sensible"));

//register custom plugin
fastify.register(require("./plugins/mongodb"));
fastify.register(require("./plugins/jwt"));
//register routes
fastify.register(require("./routes/auth"), { prefix: "/api/auth" });
//test database connection
fastify.get("/test-db", async (request, reply) => {
  try {
    const mongoose = fastify.mongoose;
    const connectionState = mongoose.connection.readyState;
    let status = "";
    switch (connectionState) {
      case 0:
        status = "disconnected";
        break;
      case 1:
        status = "connected";
        break;
      case 2:
        status = "connecting";
        break;
      case 3:
        status = "disconnecting";
        break;

      default:
        status = "unknown";
        break;
    }
    reply.send({ database: status });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ err: "failed to send test db connection" });
    process.exit(1);
  }
});

const schema = {
  type: "object",
  required: ["PORT", "MONGODB_URI", "JWT_TOKEN"],
  properties: {
    PORT: { type: "string", default: "3000" },
    MONGODB_URI: { type: "string" },
    JWT_TOKEN: { type: "string" },
  },
};

fastify.register(fastifyEnv, {
  dotenv: true,
  schema,
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
