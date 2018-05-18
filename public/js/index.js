/* Created by GH on 2018/04/20 */
$(function(){
  let $loginBox = $('.login')
  let $registerBox = $('.register')
  let $logout = $('.btn')
  $loginBox.find('.toReg').on('click',() => {
    $registerBox.show()
    $loginBox.hide()
  })
  $registerBox.find('.toLogin').on('click',() => {
    $loginBox.show()
    $registerBox.hide()
  })
  $logout.on('click',() => {
    $.ajax({
      url: '/api/user/logout',
      type: 'get',
      success: function (result) {
        if( result.code ) {
          window.location.reload()
        } else {
          alert('退出失败')
        }
      },
      error: function () {
        alert('退出失败')
      }
    })
  })
})