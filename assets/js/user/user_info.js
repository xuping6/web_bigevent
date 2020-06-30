$(function () {
  const form = layui.form;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return `昵称长度必须在 1 ~ 6 个字符之间`;
      }
    },
  });

  initUserInfo();
  // 初始化用户的信息
  function initUserInfo() {
    $.ajax({
      type: "get",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        }
        console.log(res);
        //   调用 form.val() 方法为表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }

  // 重置表单的数据  ---> 需要重新获取用户信息
  $("#btnReset").on("click", function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    // 重新获取用户信息
    initUserInfo();
  });

  // 监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 使用自己接口时，需要将接口传过来的用户名删除
    /* const inputParams = form.val('formUserInfo') // 获取表单数据
      delete inputParams.username */
    // 发起 Ajax 请求
    $.ajax({
      type: "post",
      url: "/my/userinfo",
      data: $(this).serialize(), // 获取表单数据
      // data:inputParams,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg("更新用户信息失败！");
        }
        layer.msg("更新用户信息成功！");

        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        // index 页面是父页面，每个表单信息嵌套在iframe里显示
        console.log(window.parent);

        window.parent.getUserInfo();
      },
    });
  });
});
