module.exports = {
  options: {},
  app: async (app, options) => {
    app.get("/", async (req, res) => {
      res.send(`You are ${!req.cookies.login && "not"} authenticated!`);
    });
  }
}