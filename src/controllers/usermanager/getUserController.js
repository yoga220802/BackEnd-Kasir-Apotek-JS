const User = require("../../models/user");

// Get all users
exports.getUsers = async (req, res) => {
 try {
  // Akses data user dari token
  const loggedInUser = req.user;

  // Hanya ambil data user berdasarkan role tertentu, jika diperlukan
  console.log(
   `Logged in as: ${loggedInUser.fullName}, Role: ${loggedInUser.roleid}`
  );

  const users = await User.findAll({
   attributes: ["userid", "email", "pass", "fullname", "userphone", "roleid"],
  });

  res.status(200).json({
   message: "Users retrieved successfully",
   data: users,
  });
 } catch (error) {
  console.error("Error fetching users:", error);
  res.status(500).json({
   message: "Failed to fetch users",
   error: error.message,
  });
 }
};
