/**
 * 邮箱验证码发送倒计时
 *  | 更改按钮状态
 *  | 显示倒计时
 *  | 计时结束
 *    | 清除按钮状态
 *    | 按钮文本更新
 * */
function countDown() {
  // 获取dom
  let btn = $('.getValidateCode')

  // 更改状态
  btn.data('status', 'send')
  btn.text('120秒')
  btn.addClass('email-sending')

  // 开始计时
  let start = 0
  let timmer = setInterval(function() {
    start++
    // 超时检测
    if(start === 120) {
      clearInterval(timmer)
      btn.data('status', null)
      btn.removeClass('email-sending')
      btn.text('发送验证码')
    } else {
      btn.text(120-start + '秒')
    }

  },1000)
}


// remove uncomplete-info style
function focusRemove(selector){
  $(selector).removeClass('uncomplete-info')
}



// 事件初始化
function initEvent() {
  /**
   * 提交注册
   *  | 检查信息是否完整
   *    | 对于不完整的信息进行标识提示
   */
  $('.submit').click(() => {
    // 获取dom
    let username = $('#register-username')
    let password = $('#register-password')
    let validate = $('#register-validate')
  
    // 获取值
    let userval  = username.val()
    let passval  = password.val()
    let valival  = validate.val()

    let submitFlag = true
    let reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
   
    // 邮箱
    if (!userval || !userval.match(reg)) {
      username.addClass('uncomplete-info')
      // 绑定一次
      $('#register-username').one('focus',() => {
        focusRemove('#register-username')
      })
      submitFlag = false
    }
    // 密码
    if (!passval) {
      password.addClass('uncomplete-info')
      // 绑定一次
      $('#register-password').one('focus',() => {
        focusRemove('#register-password')
      })
      submitFlag = false
    } 
    // 验证码
    if (!valival) {
      validate.addClass('uncomplete-info')
      // 绑定一次
      $('#register-validate').one('focus',() => {
        focusRemove('#register-validate')
      })
      submitFlag = false
    }

    // 信息完整提交
    if (submitFlag) {
      let form = $('#form-register')
      form.submit()
    } else {
      return
    }
  })


  /**
   * 获取验证码
   *  | 检测按钮状态
   *  | 获取邮箱
   *  | 验证信息完整性
   * */ 
  $('.getValidateCode').click(() => {

    // 检测按钮状态
    let status = $('.getValidateCode').data('status')

    // 已发送 返回
    if(status === 'send') {
      return
    }

    // 获取dom
    let username = $('#register-username')

    // 邮件正则
    let reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;

    // 获取值
    let userval  = username.val()

    // 验证信息完整性
    if (!userval || !userval.match(reg)) {
      username.addClass('uncomplete-info')
      return
    }


    // 请求验证码
    $.ajax({
      url: '/api/user/emailCheck',
      type: 'post',
      dataType: 'json',
      data: {email: userval},
      success: function(msg) {
        countDown();
      },
      error: function(err) {
        throw new Error(err)
      }
    })
  })
}

$(function(){
  initEvent();
})