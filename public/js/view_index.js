$(function () {
  /**
   * 提交评论-- view.ejs
   */
  $('#messageBtn').click(() => {
    $.ajax({
      type: 'post',
      url: '/api/comment/post',
      data: {
        contentid: $('#contentId').val(),
        content: $('#messageContent').val()
      },
      success: function (responseData) {
        $('#messageContent').val('')
        renderComment(responseData.data.comments.reverse())
      }
    })
  })

  function renderComment(comments) {
    let html = ''
    for (let val in comments) {
      html += `<div class='messageBox'>
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
    $('.messageList').html(html)
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


  $('.menu ul').css({ display: 'none' }) // Opera Fix
  $('.menu li').hover(function () {
    $(this).find('ul:first').css({ visibility: 'visible', display: 'none' }).slideDown('normal')
  }, function () {
    $(this).find('ul:first').css({ visibility: 'hidden' })
  })
})