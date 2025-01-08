const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan payload token ke `req.user`
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware untuk memeriksa role
exports.authorizeRole = (...requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user.roleid;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

exports.preventSelfDeletion = (req, res, next) => {
  const { userid } = req.params; // ID user yang akan dihapus
  const activeUserid = req.user.userid; // ID user yang sedang login (dari token JWT)

  if (userid === activeUserid) {
    return res.status(403).json({
      message: 'Anda tidak dapat menghapus akun Anda sendiri.',
    });
  }

  next(); // Lanjutkan ke handler berikutnya jika validasi lolos
};
