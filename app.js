const { build } = require('./fastify');
const { MongoClient } = require('mongodb');

module.exports = class APIWrapper {
  constructor() {
    this.config = require('./config');
    this.fastify = null
    this.mongo = null;
    this.redis = null;
    this.typesense = null;

    this.path = require('path');
    this.fs = require('fs');
    this.axios = require('axios');

    this.sitemap = [];

    this.utils = {};

    this.log('Initalized');
  }

  log = (...args) => console.log('[API]', ...args)

  async start() {
    this.log('Starting...');
    
    // Mongo DB Connection
    this.mongo = await MongoClient.connect(this.config.general.mongo.uri, {}).catch(err => (console.error(err), null));
    const databaseName = /\w\/([^?]*)/g.exec(this.config.general.mongo.uri)
    this.mongo.db = this.mongo.db(databaseName && databaseName[1]);
    
    // Redis Connection
    this.redis = new (require('ioredis'))((`redis://${this.config.general.redis.host}:${this.config.general.redis.port}`));
    
    // Fastify Setup
    this.fastify = await build(this);
    this.fastify.listen(this.config.general.port, '0.0.0.0', (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      this.log(`Listening on ${address}`);
    });

    // Cleaner exit (for PM2)
    process.on('SIGINT', () => (this.fastify.close(), process.exit()));
    process.on('SIGTERM', () => (this.fastify.close(), process.exit()));

    // Log Completion
    this.log('Started');
  }

  loadFolder(folder, cb, dircb) {
    let joined;
    for (const entry of this.fs.readdirSync(folder.replace('.', process.cwd()))) {
      joined = this.path.join(folder, entry);
      if (this.fs.lstatSync(joined).isDirectory()) dircb(this.path.join(process.cwd(), joined)), this.loadFolder(joined, cb, dircb);
      else cb(this.path.join(process.cwd(), joined))
    }
    return true;
  }
}