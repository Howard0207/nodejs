/* Created by GH on 2018/04/20 */
$(function(){
  let $loginBox = $('.login')
  let $registerBox = $('.register')
  $loginBox.find('.toReg').on('click',() => {
    $registerBox.show()
    $loginBox.hide()
  })
  $registerBox.find('.toLogin').on('click',() => {
    $loginBox.show()
    $registerBox.hide()
  })
})