const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = require('../bin/dbConfig');
const passport = require('passport');

// login page
router.get('/login', (req, res, next)=>{
  console.log(`req.isAuthenticated: ${req.isAuthenticated()}`);
  // console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  // console.log(`session: ${JSON.stringify(req.session)}`);
  // console.log(`signed cookies: ${JSON.stringify(req.signedCookies)}`);
  res.render('login');
});

// login
// router.post('/login', (req, res, next)=>{
//   res.json({ success: false, message: 'Authentication failed. No user or password' });
// });

router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: 'login'}));

// router.post('/login', function (req, res, next){
//   console.log(`body: ${JSON.stringify(req.body)}`);
//   console.log('login-start');
//   passport.authenticate('local', function (err, user, info){
//     console.log('passport-start');
//     if (err) { return next(err); }
//     if (!user) { return res.json({ success: false, message: 'Authentication failed.' }); }
//     res.json({ success: true, message: 'Authentication success.' });
//   });
// });

// router.post('/login', passport.authenticate('local'), (req, res)=>{
//   res.json({ success: false, message: 'Authentication failed. No user or password' });
// });

// router.post('/login', passport.authenticate('local'), (req, res)=>{
//   res.redirect('/user/' + req.user.username);
// });

// login-old
router.post('/login-old', (req, res, next)=>{
  console.log(`cookies-1: ${req.cookies}`);
  if (req.body.email && req.body.password) {
    mongo.db.collection(dbConfig.collUsers).findOne({email: req.body.email})
    .then(user=>{
      // console.log(JSON.stringify(user));
      // user not found
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // wrong password
        if (user.password !== req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        // success
        } else {
          res.json({ success: true, message: 'Authentication success.', user: user.email });
        }
      }
    })
    .catch(err=>{
      console.log(`POST /login err: ${err}`);
    });
  } else {
    res.json({ success: false, message: 'Authentication failed. No user or password' });
  }
});

// sign up
router.post('/sign-up', (req, res, next)=>{
  if (req.body.username && req.body.password) {
    const user = {
      username: req.body.username,
      id: req.body.username,
      password: req.body.password,
      admin: false
    };
    mongo.db.collection(dbConfig.collSession).insertOne(user)
    .then(result=>{
      res.json({ success: true, message: 'Sign up successfully accomplished' });
    })
    .catch(err=>{
      res.json({ success: false, message: 'Sign up failed' });
      console.log(`sign-up-error: ${err}`);
    });
  }
});

// token parse
// router.use(function (req, res, next) {
//   // check header or url parameters or post parameters for token
//   const token = req.body.token || req.query.token || req.headers['x-access-token'];
//   if (token) {
//     jwt.verify(token, req.app.get('secret'), function (err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   // no token received
//   } else {
//     return res.status(403).send({success: false, message: 'No token provided.' });
//   }
// });
// test
router.get('/test', (req, res, next)=>{
  console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  console.log(`session: ${JSON.stringify(req.session)}`);
  console.log(`signed cookies: ${JSON.stringify(req.signedCookies)}`);
  // const sess = req.session;
  // let user = 'no user';
  // if (sess.email) {
  //   user = sess.email;
  // }
  // res.render('test', {user: user});
  res.render('test', {email: req.session.email, password: req.session.password});
});

// user logged
router.get('/user', (req, res, next)=>{
  res.render('user');
});
module.exports = router;
