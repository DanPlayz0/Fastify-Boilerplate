module.exports = {
  options: {},
  app: async (app, options) => {
    app.get("/", async (req, res) => {
      res.send("Hello World!");
    });
  }
}