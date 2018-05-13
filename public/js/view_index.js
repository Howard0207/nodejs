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
                    <span class="fr">${comments[val].addFormateTime}</span>
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


  $(".menu ul").css({display: "none"}); // Opera Fix
  $(".menu li").hover(function(){
    $(this).find('ul:first').css({visibility: "visible",display: "none"}).slideDown("normal");
  },function(){
    $(this).find('ul:first').css({visibility: "hidden"});
  });
})