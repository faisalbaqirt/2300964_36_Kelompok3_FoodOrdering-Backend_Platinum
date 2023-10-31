const passport = require("../lib/passport");

const isAuthenticated = passport.authenticate("jwt", {
  session: false,
});

module.exports = isAuthenticated;
