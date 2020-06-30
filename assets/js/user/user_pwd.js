$(function () {
  var form = layui.form;

  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须是6到12位，且不能出现空格"],
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新旧密码不能相同";
      }
    },
    rePwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次密码不一致";
      }
    },
  });

   $(".layui-form").on("submit", function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    // 剔除 rePwd 属性
    // let params = $(this).serialize();
    // console.log(params); //oldPwd=123456&newPwd=654321&rePwd=654321
    // var arr = params.split("&");
    // var index = arr.findIndex((item) => item.includes("rePwd"));
    // arr.splice(index, 2);
    // const pwdparams = arr.join("&");

    $.ajax({
      type: "post",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更新密码失败");
        }
        layui.layer.msg("更新密码成功");
        // 重置表单 DOM对象调用reset()
        $(".layui-form")[0].reset();
      },
    });
  }); 

 /*  $(".layui-form").submit(function (e) {
    e.preventDefault();
    // 剔除 rePwd 属性
    let params = $(this).serialize().split("&");
    params.length = 2; // 取前两项数据
    $.ajax({
      type: "post",
      url: "/my/updatepwd",
      data: params.join("&"),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更新密码失败");
        }
        layui.layer.msg("更新密码成功");
        $(".layui-form")[0].reset();
      },
    });
  }); */
});
