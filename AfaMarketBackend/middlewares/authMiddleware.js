const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT and attach user to request
exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found. Invalid token." });
        }

        // Ensure KYC is verified
        if (!user.kyc.verified) {
            return res.status(403).json({ message: "KYC verification required. Please complete KYC to proceed." });
        }

        req.user = user; // Attach full user object to request
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Not authorized, invalid or expired token." });
    }
};


// Middleware to enforce KYC verification in particular routes in feauture
exports.requireKYC = (req, res, next) => {
  if (!req.user?.kyc?.verified) {
      return res.status(403).json({ message: "KYC verification required. Please complete KYC to proceed." });
  }
  next();
};

// // Middleware for authentication (Attaches decoded user to req.user)
// exports.authenticate = async (req, res, next) => {
//     let token = req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null;

//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select("-password");

//         if (!user) {
//             return res.status(401).json({ message: "User not found. Invalid token." });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("Authentication error:", error);
//         return res.status(401).json({ message: "Invalid or expired token." });
//     }
// };

// Middleware to authorize only admins
exports.authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
