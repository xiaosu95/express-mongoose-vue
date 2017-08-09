module.exports = {
  checkLogin: function (req, res, next) {
    // delete req.session.user
    console.log(req.session)
    if (!req.session.user) {
      return res.send('未登录');
    }
    req.session.a = '12344'
    next();
  }
}
