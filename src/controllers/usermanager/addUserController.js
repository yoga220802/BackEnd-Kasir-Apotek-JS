const bcrypt = require('bcrypt');
const User = require('../../models/users/user');
const Role = require('../../models/users/role');

// Add user
exports.addUser = async (req, res) => {
  try {
    const { fullname, email, password, userphone, roleid } = req.body;

    // Validasi input
    if (!fullname || !email || !password || !userphone || !roleid) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah roleid valid
    const role = await Role.findOne({ where: { roleid } });
    if (!role) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const newUser = await User.create({
      fullname,
      email,
      pass: hashedPassword,
      userphone,
      roleid,
    });

    res.status(201).json({
      message: 'User berhasil ditambahkan',
      user: {
        userid: newUser.userid,
        fullname: newUser.fullname,
        email: newUser.email,
        userphone: newUser.userphone,
        role: {
          roleid: role.roleid,
          rolename: role.rolename,
        },
      },
    });
  } catch (error) {
    console.error('Error saat menambahkan user:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
