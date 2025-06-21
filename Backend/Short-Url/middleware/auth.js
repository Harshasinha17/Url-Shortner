const { getUser } = require("../service/auth");
//authentication
function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (
    !tokenCookie 
  ) {
    return next(); // No token provided or wrong format
  }

  const token = tokenCookie;
  
  const user = getUser(token); // Assuming getUser verifies and decodes the token
  req.user = user;

  return next();
}
//authorization
function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) {
      return res.redirect("/login"); // User not authenticated
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Unauthorized"); // User doesn't have permission
    }

    return next(); // User is allowed
  };
}

module.exports = { checkForAuthentication ,
    restrictTo,
};
