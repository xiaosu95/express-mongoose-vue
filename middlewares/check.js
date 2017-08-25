module.exports = {
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      return res.send({
        isSuccess: 0,
        msg: '请登录'
      });
    }
    next();
  }
}
