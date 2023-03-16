 const userModel = require('../models/userModel');
 const jwt = require('jsonwebtoken');

// const checkRole = (roles) => async (req, res, next) => {
//   const { email } = req.user; // assuming that the email is stored in the req.user object

//   // retrieve user info from the database
//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return res.status(401).json("User not found");
//   }

//   if (!roles.includes(user.role)) {
//     return res.status(401).json("Sorry you do not have access to this route");
//   }

//   return next();
// };

// module.exports = checkRole;


function verifyRole(roles) {
  return function(req, res, next) {
    if (req.user && _.isEqual(roles, req.user.roles)) {
      next(); // Allow the user to access the route
    } else {
      res.status(403).json({ message: "Access forbidden" }); // Return 403 Forbidden status
    }
  };
}

module.exports = verifyRole;

