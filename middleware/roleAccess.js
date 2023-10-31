
const checkRole = async (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    console.log('Akses ditolak');
    res.status(403).json({ message: 'Akses ditolak' });
  }
}



module.exports = checkRole;
