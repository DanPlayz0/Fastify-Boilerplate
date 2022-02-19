module.exports = {
  options: {},
  app: async (app, options) => {
    app.get("/", async (req, res) => {
      res
        .clearCookie('login', { httpOnly: true, path: "/", domain: app.wrapper.config.cookies.domain })
        .send("You were logged out!");
    });
  }
}