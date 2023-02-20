/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express, { type Request, type Response } from 'express';
import passport from 'passport';
// @ts-expect-error next line
import GoogleStrategy from 'passport-google-oidc';
import config from 'config';
import db from '../db';

const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: config.get('GOOGLE_CLIENT_ID'),
    clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile']
  }, function verify (issuer: any, profile: any, cb: any) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function (err, row) {
      if (err) { return cb(err); }
      if (!row) {
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function (err) {
          if (err) { return cb(err); }

          const id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function (err) {
            if (err) { return cb(err); }
            const user = {
              id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        db.get('SELECT * FROM users WHERE id = ?', [row.user_id], function (err, row) {
          if (err) { return cb(err); }
          if (!row) { return cb(null, false); }
          return cb(null, row);
        });
      }
    });
  }));

  passport.serializeUser((user: any, cb: any) => {
    process.nextTick(() => {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });

  passport.deserializeUser((user: any, cb: any) => {
    process.nextTick(() => {
      return cb(null, user);
    });
  });

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/login'
  }));

router.get('/login', function (req: Request, res: Response, next) {
  res.render('login');
});

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
      if (err) { next(err); return; }
      res.redirect('/');
    });
  });

module.exports = router;
