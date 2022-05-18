// const jwt = require("jsonwebtoken");
// const db = require("../models");

// async function requiresToken(req, res, next) {
//   try {
//     //   get token from the client
//     const token = req.headers.authorization;
//     // verify the token -- if not verified will wind up in catch
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded);
//     // find the user from the data in the token
//     const foundUser = await db.User.findById(decoded.id);
//     // mount the user on the response for the next  middle/route
//     res.locals.user = foundUser;
//     // invoke next() to go to the next middleware function
//     next();
//   } catch (err) {
//     // if we are down here -- authentication has failed
//     console.log(err);
//     res.status(401).json({ msg: "you are not allowed here, nice try hacker" });
//   }
// }

// module.exports = requiresToken;
