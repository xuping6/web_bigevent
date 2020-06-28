$(function () {
  // 调用 getUserInfo() 获取用户基本信息
  getUserInfo();

  var layer = layui.layer;

  // 点击按钮，实现退出功能
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        // 1.情况本地存储中的token
        localStorage.removeItem("token");
        // 2.重新跳转到登录页面
        location.href = "http://127.0.0.1:5500/code/login.html";

        // 关闭 confirm 询问框
        layer.close(index);
      }
      // function () {
      //   // 取消回调
      //   console.log("cancel");
      // }
    );
  });
});

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    type: "get",
    url: "/my/userinfo", // baseApi中已经根路径拼接了
    // headers 就是请求头配置对象（有权限，需要身份认证）

    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
        // return layui.layer.msg(res.message)  // 一般从后台中取数据
      }
      // 调用 renderAvatar() 渲染用户的头像
      renderAvatar(res.data);
    },

    // 不论成功还是失败，最终都会调用 complete 回调
  });
}

// 渲染用户头像
function renderAvatar(user) {
  // 1. 获取用户的名称（优先获取昵称）
  // const {nickname = '',user_pic} = res.data
  var name = user.nickname || user.username;
  // 2. 设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // 3. 按需渲染用户的头像（优先获取到图片头像）
  if (!user.user_pic) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avtar").hide();
  } else {
    // 3.2 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avtar").html(first).show();
  }
}
