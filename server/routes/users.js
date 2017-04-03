var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// login
router.get('/login', (req, res, next)=>{
});
// logout
router.get('/logout', (req, res, next)=>{
});
// test
router.get('/test', (req, res, next)=>{
  const sess = req.session;
  if (sess.views) {
    sess.views++;
  } else {
    sess.views = 1;
  }
  res.render('test', {count: sess.views});
});
module.exports = router;
