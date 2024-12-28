const User = require('../../models/users/user');
const Role = require('../../models/users/role');

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;

    // Validasi input
    if (!userid) {
      return res.status(400).json({ message: 'User ID wajib diberikan' });
    }

    // Cari user berdasarkan userid
    const user = await User.findOne({ where: { userid } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Hapus user
    await user.destroy();

    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus user:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
