const jwt = require('jsonwebtoken');

module.exports = (user) => ({
  token: 'Bearer ' + jwt.sign({ id: user.useraccount_id,role:user.role_id },
   "secret"),user
  });