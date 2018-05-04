$(function(){
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
      success: function(responseData) {
        $('#messageContent').val('')
        renderComment(responseData.data.comments.reverse())
      }
    })
  })

  function renderComment(comments) {
    let html=''
    for(let val in comments){
      html += `<div class="messageBox">
                  <p class="name clear">
                    <span class="fl">${comments[val].username}</span>
                    <span class="fr">${comments[val].postTime}</span>
                  </p>
                  <p>${comments[val].content}</p>
                </div>`
    }
    $('.messageList').html(html);
  }

  $.ajax({
    type: 'get',
    url:'/api/comment',
    data: {
      contentid: $('#contentId').val()
    },
    success: function(responseData) {
      renderComment(responseData.data.reverse())
    }
  })
})