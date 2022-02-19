module.exports = {
  general: {
    port: 3000,
    domain: 'https://example.com',
    redis: {
      host: 'localhost',
      port: 6379,
      prefix: 'FASTIFYAPI:',
    },
    mongo: {
      uri: 'mongodb://username:password@localhost:27017/fastifyapi?authSource=admin&retryWrites=true&ssl=false',
    },
  },
  cookies: {
    secret: "A_SECRET_COOKIE", // Secret passphrase for cookies
    expires: 604800, // 7 Days
    domain: ".example.com" // Allows for the auth cookie to be set for all subdomains (prefix with `.`)
  }
};