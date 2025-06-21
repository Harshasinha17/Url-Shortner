const jwt = require("jsonwebtoken");
const secret = "harsha@123";

function setUser(user) {
    return jwt.sign({
        _id: user.id,
        email: user.email,
        role:user.role,
    }, secret);
}

function getUser(token) {
    if (!token) return null;

    try {
        return jwt.verify(token, secret);  // secret defined earlier
    } catch (error) {
        console.error("JWT error:", error.message); // Optional: for debugging
        return null;
    }
}


module.exports = {
    setUser,
    getUser,
};
