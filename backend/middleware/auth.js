const jwt = require('jsonwebtoken');
const jwtSecret = "my secret token";  // Secret key used for signing the JWT

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');  // Ensure the frontend sends 'x-auth-token'

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        console.log("Token received:", token);  // Log the received token for debugging

        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        console.log("Decoded JWT:", decoded);  // Log the decoded token for debugging

        // Set user data from the decoded token
        req.user = decoded.User;

        // Optionally extend the token's expiration by re-signing it
        const newToken = jwt.sign(
            { User: req.user },  // The same user data
            jwtSecret,           // The same secret used for signing
            { expiresIn: '1h' }  // Set new expiration time (e.g., 1 hour)
        );

        // Add the new token to the response headers for the client to use
        res.setHeader('x-auth-token', newToken);
        
        console.log("Middleware req.user:", req.user);


        // Proceed with the next middleware or route handler
        next();

    } catch (err) {
        console.error("JWT Verification Error:", err.message);  // Log verification error
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
