// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
// ajaxPrefilter 函数用于预先

$.ajaxPrefilter(function (options) {
  // 统一添加请求的基准路径
  options.url = "http://ajax.frontend.itheima.net" + options.url;
});
