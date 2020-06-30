// 导入 express
const express = require("express");
// 创建服务器的实例对象
const app = express();

// 导入配置规则
const joi = require("@hapi/joi");

// 导入 cors 中间件
const cors = require("cors");
// 将 cors 注册为全局中间件
app.use(cors());

// 配置解析表单数据的中间件  ---> 写在注册路由中间件之前
app.use(express.urlencoded({ extended: false }));
// 托管静态资源文件
app.use("/uploads", express.static("./uploads"));

// 一定要在路由之前 手动封装 res.cc 函数 响应数据的中间件
app.use((req, res, next) => {
  // status 默认设置为1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是也一个错误的描述字符串
  // 对函数参数进行解构给默认值的时候，最好在最后一个参数
  res.cc = function (err, status = 1) {
    res.send({
      status,
      // 状态描述，判断 err 是错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 一定要在路由之前配置解析 token 的中间件
const expressJWT = require("express-jwt");
// 导入配置文件（解密）
const config = require("./config");
// 解析 token ，身份认证
app.use(
  expressJWT({ secret: config.secretKey }).unless({ path: [/^\/api\//] })
);

// 导入用户信息路由模块
const userinfoRouter = require("./router/userinfo");
// 注意：以/my 开头的接口，都是有权限的接口，需要 token 身份认证
app.use("/my", userinfoRouter);

// 导入注册路由中间件
const userRouter = require("./router/user");
const { secretKey } = require("./config");
app.use("/api", userRouter);

// 导入文章分类路由模块
const artCateRouter = require("./router/artcate");
// 为文章分类的路由挂载统一的访问前缀
app.use("/my/article", artCateRouter);

// 导入文章路由模块
const articleRouter = require("./router/article");
app.use("/my/article", articleRouter);

// 错误中间件
app.use((err, req, res, next) => {
  // 数据验证失败  err 是否是 joi.ValidationError的实例
  if (err instanceof joi.ValidationError) {
    return res.cc(err);
  }
  // 捕获身份认证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.cc("身份认证失败");
  }
  // 未知错误
  res.cc(err);
});

// 启动服务器
app.listen(3007, () => {
  console.log("http://127.0.0.1:3007");
});
