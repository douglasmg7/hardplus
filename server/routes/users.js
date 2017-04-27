const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = require('../bin/dbConfig');
const passport = require('passport');

// login page
router.get('/login', (req, res, next)=>{
  console.log(`req.isAuthenticated: ${req.isAuthenticated()}`);
  // console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  console.log(`session: ${JSON.stringify(req.session)}`);
  console.log(`signed cookies: ${JSON.stringify(req.signedCookies)}`);
  console.log(`req.user: ${JSON.stringify(req.user)}`);
  res.render('login');
});

// login
router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: 'login'}));

// logout
router.post('/logout', (req, res, next)=>{
  console.log(`req.isAuthenticated: ${req.isAuthenticated()}`);
  console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  console.log(`session: ${JSON.stringify(req.session)}`);
  req.logout();
  console.log('logout');
  res.json({ success: true, message: 'Logout.' });
});

// sign up
router.post('/sign-up', (req, res, next)=>{
  if (req.body.username && req.body.password) {
    const user = {
      username: req.body.username,
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

router.get('/test', (req, res, next)=>{
  console.log(`cookies: ${JSON.stringify(req.cookies)}`);
  console.log(`session: ${JSON.stringify(req.session)}`);
  console.log(`signed cookies: ${JSON.stringify(req.signedCookies)}`);
  let user = 'no user';
  if (req.user) { user = req.user.username; }
  res.render('test', {user: user});
});

// user logged
router.get('/user', (req, res, next)=>{
  res.render('user');
});

// login
// router.post('/login', (req, res, next)=>{
//   res.json({ success: false, message: 'Authentication failed. No user or password' });
// });

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

module.exports = router;
