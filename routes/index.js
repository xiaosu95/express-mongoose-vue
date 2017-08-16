module.exports = function (app) {
  app.use('/user', require('./user'));
  app.use('/chat', require('./chat'));
}
