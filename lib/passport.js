const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../db/db");

const options = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),

  secretOrKey: "b36709837c301f474a0199f4c4b4e82e",
};

const verify = (payload, done) => {
  db("users")
    .where({
      id: payload.id,
    })
    .first()
    .then((user) => {
      if (!user) {
        return done(null, false, {
          messsge: "User not found",
        });
      }
      return done(null, user);
    })
    .catch((err) => {
      return done(err, false, {
        messsge: err.messsge,
      });
    });
};

passport.use(new JwtStrategy(options, verify));

module.exports = passport;
