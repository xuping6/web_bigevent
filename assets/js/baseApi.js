// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
// ajaxPrefilter 函数用于预先

$.ajaxPrefilter(function (options) {
  // 统一添加请求的基准路径
  options.url = "http://127.0.0.1:3007" + options.url;

  // 统一为有权限的接口，设置 headers 请求头
  if (options.url.includes("/my/")) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调
  options.complete = function (res) {
    // console.log(res);
    // const { status, message } = res.responseJSON;
    // 先判断有没有登录，没有登录，就去登录，获取token
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 1.强制清空 token
      localStorage.removeItem("token");
      // 2.强制跳转到登录页面
      location.href = "/login.html";
    }
  };
});
