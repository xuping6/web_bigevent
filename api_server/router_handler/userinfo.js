// 用户信息的处理函数模块

// 导入数据库操作模块
const db = require("../db/index");

// 导入 bcryptjs
const bcrypt = require("bcryptjs");

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 正式在用 token 解析出来的属性,将id 重命名为userId
  const { id: userId } = req.user;

  // 定义 SQL 语句
  const sql =
    "select id, username,nickname,email,user_pic from ev_users where id=?";
  db.query(sql, userId, (err, results) => {
    //  执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 成功，但是查询到的数据条不等于1
    if (results.length !== 1) {
      return res.cc("获取用户信息失败");
    }
    // 成功，将用户信息响应给客户端
    res.send({
      status: 0,
      msg: "获取用户信息成功",
      data: results[0],
    });
  });
};

// 更新用户信息
exports.updateUserInfo = (req, res) => {
  // 定义 SQL 语句
  const sql = "update ev_users set? where id=?";
  // 通过用户传入的 id 进行修改
  db.query(sql, [req.body, req.body.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) {
      return res.cc("修改用户信息失败");
    }
    // 成功
    return res.cc("修改用户信息成功", 0);
  });
};

// 重置密码
exports.updatePassword = (req, res) => {
  // 判断用户是否存在
  const { id } = req.user;
  // 定义根据 id 查询用户数据的 SQL 语句
  const sql = "select * from ev_users where id =?";
  db.query(sql, id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功，判断是否存在
    if (results.length !== 1) {
      return res.cc("用户不存在");
    }
    // 判断提交的 旧密码 是否正确
    // bcrypt.compareSync(用户提交的密码，数据库存的密码)
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("原密码错误");
    }
    // 定义更新用户密码的 SQL 语句
    const sql = "update ev_users set password=? where id =?";
    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) {
        return res.cc(err);
      }
      // 执行成功，但是影响行数不等于1
      if (results.affectedRows !== 1) {
        return res.cc("更新密码失败");
      }
      // 更新密码成功
      res.cc("更新密码成功", 0);
    });
  });
};

// 更新头像
exports.updateAvatar = (req, res) => {
  // 定义 SQL 语句
  const sql = "update  ev_users  set user_pic=? where id=? ";
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) {
      return res.cc("更换头像失败");
    }
    // 更换成功
    return res.cc("更换用户头像成功", 0);
  });
};
