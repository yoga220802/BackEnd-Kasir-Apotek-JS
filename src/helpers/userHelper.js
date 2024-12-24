/**
 * Helper function to format user data
 * @param {Object} user - User data from the database
 * @returns {Object} Formatted user data
 */
const formatUser = (user) => ({
    userid: user.userid,
    fullname: user.fullname,
    email: user.email,
    userphone: user.userphone,
    role: {
      roleid: user.role.roleid,
      rolename: user.role.rolename,
    },
    createdat: user.createdat,
    updatedat: user.updatedat,
  });
  
  module.exports = {
    formatUser,
  };
  