module.exports = {
  port: 3000,
  session: {
    secret: 'session',
    key: 'session',
    maxAge: 30000 * 1000 * 60
  },
  // mongodb: 'mongodb://xiaosu:123456@localhost:27017/admin',
  mongodb: 'mongodb://localhost:27017/test',
  qiniuAccessKey: 'm-tMW5Auw4wdKqs0UGcKFTcUPfpFBG4MdJNYdWUu',
  qiniuSecretKey: 's1S_Q7bjpD3IGiQ8CtqGA7kZW-IajwQ64NKP09rP'
};
