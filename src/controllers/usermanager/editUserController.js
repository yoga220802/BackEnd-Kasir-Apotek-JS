const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Role = require('../../models/role');

// Edit user
exports.editUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const { fullname, email, password, userphone, roleid } = req.body;

    // Cari user berdasarkan userid
    const user = await User.findOne({ where: { userid } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Jika ada password, enkripsi sebelum menyimpannya
    let updatedFields = {};
    if (password) {
      updatedFields.pass = await bcrypt.hash(password, 10);
    }

    // Tambahkan field lain jika ada di request body
    if (fullname) updatedFields.fullname = fullname;
    if (email) updatedFields.email = email;
    if (userphone) updatedFields.userphone = userphone;

    let roleName = null; // Variabel untuk menyimpan nama role
    if (roleid) {
      // Validasi roleid
      const role = await Role.findOne({ where: { roleid } });
      if (!role) {
        return res.status(400).json({ message: 'Role tidak valid' });
      }
      updatedFields.roleid = roleid;
      roleName = role.rolename; // Simpan nama role untuk response
    }

    // Update user
    await user.update(updatedFields);

    // Response setelah update
    res.status(200).json({
      message: 'User berhasil diperbarui',
      user: {
        userid: user.userid,
        fullname: user.fullname,
        email: user.email,
        userphone: user.userphone,
        role: {
          roleid: user.roleid,
          rolename: roleName || (await Role.findOne({ where: { roleid: user.roleid } })).rolename,
        },
      },
    });
  } catch (error) {
    console.error('Error saat memperbarui user:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
