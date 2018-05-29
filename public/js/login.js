// 事件初始化
function initEvent() {
  /**
   * 登录
   *  | 获取数据
   *  | 验证数据结构
   *  | 检测数据完整性
   */
  $('.submit').click(() => {
    // 获取dom
    let username = $('#login-username')
    let password = $('#login-password')

    // 邮件正则
    let reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/

    // 获取值
    let userval    = username.val()
    let passval    = password.val()
    let submitFlag = true

    // 验证邮箱
    if (!userval || !userval.match(reg)) {
      username.addClass('uncomplete-info')
      // 绑定一次
      $('#login-username').one('focus',() => {
        focusRemove('#login-username')
      })
      submitFlag = false
    }

    // 密码
    if (!passval) {
      password.addClass('uncomplete-info')
      // 绑定一次
      $('#login-password').one('focus',() => {
        focusRemove('#login-password')
      })
      submitFlag = false
    } 

    // 信息完整提交
    if (submitFlag) {
      let form = $('#form-login')
      form.submit()
    } else {
      return
    }

  })
}

// remove uncomplete-info style
function focusRemove(selector){
  $(selector).removeClass('uncomplete-info')
}

$(function(){
  initEvent()
})