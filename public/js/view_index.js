$(function () {
  // 页面常量 评论字数限制
  const commentLimit = 600

  /**
   * 提交评论-- view.ejs
   */
  $('#messageBtn').click(() => {
    // 获取评论
    let content = $('#messageContent').val()

    // 符号转义
    content = content.replace(/</g,'&lt;').replace(/>/g,'&gt;')

    $.ajax({
      type: 'post',
      url: '/api/comment/post',
      data: {
        contentid: $('#contentId').val(),
        content: content
      },
      success: function (responseData) {
        // 评论-num 的Dom
        let commentsNum = $('.comments-num')
        
        // 接收数据
        let comments = responseData.data.comments
        
        // 清空评论区
        $('#messageContent').val('')
        
        // 评论数更新
        commentsNum.text(comments.length)

        // 评论内容更新
        renderComment(comments.reverse())
      }
    })
  })


  // 评论内容渲染
  // function renderComment(comments) {
  //   let messageList = $('.messageList')
  //   // 清空评论
  //   messageList.empty()
  //   for (let val in comments) {
  //     let messageBox = $(
  //       `<div class='messageBox'>
  //         <div class='message-header>
  //           <a class='message-user'>
  //             <span class='message-username'>${comments[val].username}</span>
  //           </a>
  //           <span class='message-addTime'>${comments[val].addFormateTime}</span>
  //         </div>
  //         <div class='message-content'>
  //           <p class='message-detail'>${comments[val].content}</p>
  //         </div>
  //       </div>`)
  //     messageList.append(messageBox)
  //     // messageBox.find('.message-detail').text(comments[val].content)
  //   }
  // }
  function renderComment(comments) {
    let messageList = $('.messageList')
    let html = ''
    for (let val in comments) {
      html += 
        `<div class='messageBox'>
          <div class='message-header>
            <a class='message-user'>
              <span class='message-username'>${comments[val].username}</span>
            </a>
            <span class='message-addTime'>${comments[val].addFormateTime}</span>
          </div>
          <div class='message-content'>
            <p class='message-detail'>${comments[val].content}</p>
          </div>
        </div>`
    }
    messageList.html(html)
  }

  $.ajax({
    type: 'get',
    url: '/api/comment',
    data: {
      contentid: $('#contentId').val()
    },
    success: function (responseData) {
      renderComment(responseData.data.reverse())
    }
  })

  // 监听评论长度
  $('#messageContent').on('input propertychange', function(){

    // 评论内容
    let val = $(this).val()
    // 评论内容长度
    let len = val.length
    // 定义剩余字数
    let left = 0

    // 判断是否超出长度
    if(len>600) {
      // 超出长度截取内容
      val = val.slice(0,commentLimit)
      // 更新内容
      $(this).val(val)
      // 修改内容长度
      len = commentLimit
    }
    
    // 剩余评论字数
    left = commentLimit - len
    $('.limit-wrapper').find('.limit').text(left)
  })
  // 菜单hover事件
  $('.menu .userInfo-wrapper').css({display: 'none'}) // Opera Fix
  $('.menu .userInfo').hover(function(){
    $(this).find('.userInfo-wrapper').css({visibility: 'visible',display: 'none'}).slideDown('normal')
  },function(){
    $(this).find('.userInfo-wrapper').slideUp('normal')
  })
})