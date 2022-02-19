const Fastify = require("fastify");

const fastifyRawBody = require("fastify-raw-body");
const fastifyCookie = require("fastify-cookie");
const fastifyHelmet = require("fastify-helmet");
const fastifyFormBody = require("fastify-formbody");

module.exports.build = async (wrapper) => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: { prettyPrint: true },
    ignoreTrailingSlash: true,
  });

  // Custom Variables
  await fastify.decorate('wrapper', wrapper);
  await fastify.decorate('mongo', wrapper.mongo);
  await fastify.decorate('redis', wrapper.redis);

  // Plugins
  await fastify.register(fastifyRawBody, { runFirst: true });
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyHelmet);
  await fastify.register(fastifyFormBody);
  
  // Route Loading
  fastify.get('/', async (request, reply) => { return { message: "This isn't public, dum dum" } });
  fastify.get('/sitemap', async (request, reply) => { return wrapper.sitemap });
  wrapper.log('Loading routes...');
  wrapper.loadFolder(`./routes`, async (file) => {
    const route = require(file), routePath = file.replace(process.cwd(), '').replace(/\/routes\//, '').replace(/\..+$/,'');
    wrapper.sitemap.push(routePath);
    await fastify.register(route.app, { prefix: routePath });
  }, (dir) => {
    const routePath = dir.replace(process.cwd(), '').replace(/\/routes/, '');
    fastify.get(routePath, (request, reply) => { return { endpoints: wrapper.sitemap.filter(m=>m.startsWith(routePath)) } });
  });

  // CORS
  fastify.addHook('preHandler', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
  });

  // Properly close the server
  fastify.addHook('onClose', (app, done) => {
    wrapper.mongo.close();
    wrapper.redis.disconnect();
    console.log(`r i p`);
    done();
  });

  // Return the web-server
  return fastify;
};