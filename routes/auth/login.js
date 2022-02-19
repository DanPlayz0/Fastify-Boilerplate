module.exports = {
  options: {},
  app: async (app, options) => {
    app.get("/", async (req, res) => {
      res.setCookie('login', "yes", { httpOnly: true, domain: app.wrapper.config.cookies.domain, path: "/" });
      res.send("You were logged in!");
    });
  }
}