// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
// ajaxPrefilter 函数用于预先

$.ajaxPrefilter(function (options) {
  // 统一添加请求的基准路径
  options.url = "http://ajax.frontend.itheima.net" + options.url;

  // 统一为有权限的接口，设置 headers 请求头
  if (options.url.includes("/my/")) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调
  options.complete = function (res) {
    // console.log(res);

    const { status, message } = res.responseJSON;
    if (status === 1 && message === "身份认证失败") {
      // 1.强制清空 token
      localStorage.removeItem("token");
      // 2.强制跳转到登录页面
      location.href = "http://127.0.0.1:5500/code/login.html";
    }
  };
});
