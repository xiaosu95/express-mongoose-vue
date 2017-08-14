module.exports = {
  port: 3000,
  session: {
    secret: 'session',
    key: 'session',
    maxAge: 30 * 1000 * 60
  },
  mongodb: 'mongodb://localhost:27017/test'
};
