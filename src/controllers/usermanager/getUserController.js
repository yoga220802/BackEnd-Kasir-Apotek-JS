const User = require("../../models/user");
const Role = require("../../models/role");

// Get all users

exports.getUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['userid', 'fullname', 'email', 'userphone'], // Hilangkan 'pass'
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['roleid', 'rolename'],
          },
        ],
      });
  
      const formattedUsers = users.map((user) => ({
        userid: user.userid,
        fullname: user.fullname,
        email: user.email,
        userphone: user.userphone,
        role: {
          roleid: user.role.roleid,
          rolename: user.role.rolename,
        },
      }));
  
      res.status(200).json({
        message: "Users retrieved successfully",
        data: formattedUsers,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getUserById = async (req, res) => {
    console.log('Request Params:', req.params);
    try {
      const { userid } = req.params; // Pastikan ini tidak undefined
      if (!userid) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const user = await User.findOne({
        where: { userid },
        attributes: ['userid', 'fullname', 'email', 'userphone'], // Hilangkan 'pass'
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['roleid', 'rolename'],
          },
        ],
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const formattedUser = {
        userid: user.userid,
        fullname: user.fullname,
        email: user.email,
        userphone: user.userphone,
        role: {
          roleid: user.role.roleid,
          rolename: user.role.rolename,
        },
      };
  
      res.status(200).json({
        message: "User retrieved successfully",
        data: formattedUser,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  