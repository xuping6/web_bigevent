// 路由处理函数模块

// 2.检测用户名是否被占用
// 2.1 导入数据库操作模块
const db = require("../db/index");

// 导入 bcryptjs 包
const bcrypt = require("bcryptjs");
// 导入 jsonwebtoken 包
const jwt = require("jsonwebtoken");
// 导入全局的配置文件（加密解密 token 的密钥）
// const config = require("../config");
const { secretKey, expiresIn } = require("../config");

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 1. 检测表单数据是否合法  body query params -> 用户对某个表单 ajax -> data -> 后端也会做一次数据校验
  // 1.1 获取客户端提交到服务器的数据
  // const userinfo = req.body;
  let { username, password } = req.body; // 解构对象,等号左右两边格式要一致，两边都是对象
  // 1.2 对表单中的数据，进行合法性的校验
  /* if (!username || !password) {  效率低
     return res.send({
       status: 1,
       msg: "用户名或密码不合法",
     });
  } */
  // res.send("reguser ok"); 上面回调是异步，先执行该行同步，会报错

  // 2.2 定义 SQL 语句
  const sql = "select * from ev_users where username=?";
  // 2.3 执行 SQL 语句并根据结果判断用户名是否被占用
  db.query(sql, username, (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      // return res.send({
      //   status: 1,
      //   msg: err.message,
      // });
      return res.cc(err);
    }

    // 用户名被占用
    if (results.length > 0) {
      // return res.send({
      //   status: 1,
      //   msg: "用户名被占用",
      // });
      return res.cc("用户名被占用");
    }

    // 2.4 对密码进行加密处理
    // 2.4.2 调用 bcrypt.hashSync() 对密码进行加密
    password = bcrypt.hashSync(password, 10);

    // 2.5 插入新用户
    // 2.5.1 定义插入用户的SQL语句
    const sql = "insert into ev_users set?";
    // 2.5.2 调用 db.query() ,插入新用户
    db.query(sql, { username, password }, (err, results) => {
      // 执行 SQL 失败
      if (err) {
        // return res.send({
        //   status: 1,
        //   msg: err.message,
        // });
        return res.cc(err);
      }

      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        // return res.send({
        //   status: 1,
        //   message: "注册用户失败，请稍后再试",
        // });
        return res.cc("注册用户失败，请稍后再试");
      }
      // 注册成功
      res.send({
        status: 0,
        msg: "注册成功",
      });
    });
  });
};

// 登录的处理函数
exports.login = (req, res) => {
  // 1.接收表单数据
  let { username, password } = req.body;
  // 2.定义SQL语句
  const sql = "select * from ev_users where username =?";
  // 3.查询用户信息
  db.query(sql, username, (err, results) => {
    // 执行SQL失败
    if (err) {
      return res.cc(err);
    }
    // 执行成功，但是查询到数据条数不等于1
    if (results.length !== 1) {
      return res.cc("登录失败");
    }
    // 判断用户输入的密码是否正确
    // 1.用户输入的密码，和数据库中存储的密码进行比较（数据库里的密码是加密的，需要解密）
    const compareResult = bcrypt.compareSync(password, results[0].password);
    if (!compareResult) {
      return res.cc("登录失败");
    }
    // 登录成功---> 生成 token 字符串
    // 核心注意点：在生成 token 字符串的时候，要剔除密码和头像的值
    // 1.剔除完毕后，只保留了用户的 id,username,nickname,email
    // 拼接对象（合并属性）
    // const user = { ...results[0], password: '', user_pic: '' }
    // Object.assign 第一个参数是一个源对象，后面的属性会覆盖前面的（浅拷贝）
    const user = Object.assign(
      { ...results[0] },
      { password: "", user_pic: "" }
    );
    // 加密
    const token = jwt.sign(user, secretKey, { expiresIn });
    res.send({
      status: 0,
      msg: "登录成功",
      token: `Bearer ${token}`,
    });
  });
};
