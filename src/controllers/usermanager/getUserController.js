const User = require("../../models/user");
const Role = require("../../models/role");
const { formatUser } = require("../../helpers/userHelper");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['userid', 'fullname', 'email', 'userphone', 'createdat', 'updatedat'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['roleid', 'rolename'],
        },
      ],
    });

    const formattedUsers = users.map(formatUser);

    res.status(200).json({
      message: "Users retrieved successfully",
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({
      where: { userid },
      attributes: ['userid', 'fullname', 'email', 'userphone', 'createdat', 'updatedat'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['roleid', 'rolename'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: formatUser(user),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
