// ✅ Import jsonwebtoken library to verify tokens
const jwt = require('jsonwebtoken');

// ✅ Export the middleware function
module.exports = (req, res, next) => {
  // ✅ Get the Authorization header from the incoming request
  const authHeader = req.get('Authorization');

  // ✅ If no Authorization header, user is not authenticated
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // ~~~~~~~~~~~~~~~
  // ✅ Authorization header looks like: "Bearer YOUR_TOKEN"
  // Split by space and get the token part
  const token = authHeader.split(' ')[1];
  
  // ✅ If no token or empty token, user is not authenticated
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    // ✅ Verify the token with the secret key
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    // ✅ If verification fails, mark as unauthenticated
    req.isAuth = false;
    return next();
  }

  // ✅ If decoding fails for any reason, mark as unauthenticated
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  // ✅ If all checks pass: mark as authenticated
  req.isAuth = true;
  req.userId = decodedToken.userId; // Add the userId from the token to the request

  next(); // ✅ Continue to the next middleware or resolver
};
