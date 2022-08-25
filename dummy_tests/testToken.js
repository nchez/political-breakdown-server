const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtTest = async () => {
  try {
    // simulate a server response when a user is logged in
    // create jwt payload
    const payload = {
      name: "hi im a user",
      id: "jkasdf1234tfgdt5",
      // password???? -- NO, this gets sent around
      email: "email@domain.com",
    };
    // sign the jwt
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    }); // expires in is how long the token is good for
    console.log(token);
    // decode the jwt -- make sure that the secre in the jwt is the same as our server's secret
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
  } catch (err) {
    console.log(err);
  }
};

jwtTest();
