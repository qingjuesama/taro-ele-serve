'use strict';

const fs = require('fs');
const { join } = require('path');

module.exports = {
  getUsers() {
    // 获取用户信息
    const usersJson = fs.readFileSync(
      join(__dirname, '../data/user.json'),
      'utf-8'
    );
    const users = JSON.parse(usersJson).users;
    return users;
  },

  saveUsers(users) {
    users = JSON.stringify({ users });
    fs.writeFileSync(join(__dirname, '../data/user.json'), users);
  },
};
