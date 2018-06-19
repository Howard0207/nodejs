$(function () {
  // 页面常量 评论字数限制
  const commentLimit = 600
  // 每页评论数限制
  const limit = 10
  // 评论内容
  let comments = null
  // 分页插件
  let pagenation = null
  // 分页插件
  class Pagenation {
    constructor(options,cb) {
      this.pages = options.pages
      this.container = options.container
      this.limit = options.limit
      this.containerClear()
      this.init()
      this.cb = cb || function() {}
    }

    init() {
      let pages = this.pages
      let limit = this.limit - 2
      this.appendPrevDisabled()
      this.appendNode(1,1)
      if(pages>limit) {
        for(let i= 1; i< limit; i++ ){
          this.appendPage(i + 1)
        }
        this.appendOmit()
        this.appendPage(pages)
      } else {
        for(let i= 1; i< pages; i++ ){
          this.appendPage(i+1)
        }
      }
      if(pages === 1) {
        this.appendNextDisabled()
      } else {
        this.appendNext()
      }
      $(this.container).append('<li><a>总共'+ pages +'页</a></li>')
      $(this.container).append('<li><a>跳转至<input type="number" id="jump-page">页</a></li>')
      this.pevent()
    }

    reLayout(num) {
      let pages = this.pages
      let limit = this.limit - 2
      this.containerClear()
      this.appendPrev()
      // 页码小于10
      if(pages<=limit) {
        for(let i= 1; i<= pages; i++ ){
          this.appendNode(num,i)
        }
      } else { // 页码大于10

        if(num>pages - limit + 2) {
          this.appendPage(1)
          this.appendOmit()

          for(let i= pages - limit + 1 ; i<= pages; i++ ){
            this.appendNode(num,i)
          }

        } else if(num < limit - 2) {

          for(let i= 1; i< limit + 1; i++ ){
            this.appendNode(num,i)
          }
          this.appendOmit()
          this.appendPage(pages)
        } else {
          this.appendPage(1)
          this.appendOmit()
          for(let i= num-Math.floor(limit/2-1),len = num + Math.ceil(limit/2 -1); i< len; i++ ){
            this.appendNode(num,i)
          }
          this.appendOmit()
          this.appendPage(pages)
        }
      }
      this.appendNext()
      $(this.container).append('<li><a>总共'+ pages +'页</a></li>')
      $(this.container).append('<li><a>跳转至<input type="number" id="jump-page">页</a></li>')
      this.pevent()
    }

    containerClear() {
      $(this.container).empty()
    }

    appendPrev() {
      $(this.container).append('<li class="prev-wrapper"><a href="javascript:void(0)" class="page-prev">上一页</a></li>')
    }

    appendPrevDisabled() {
      $(this.container).append('<li class="prev-wrapper disabled"><a href="javascript:void(0)" class="page-prev">上一页</a></li>')
    }

    appendNext() {
      $(this.container).append('<li class="next-wrapper"><a href="javascript:void(0)" class="page-next">下一页</a></li>')
    }

    appendNextDisabled() {
      $(this.container).append('<li class="prev-wrapper disabled"><a href="javascript:void(0)" class="page-prev">下一页</a></li>')
    }

    appendOmit() {
      $(this.container).append('<li><a href="javascript:void(0)" class="page-stl">...</a></li>')
    }

    appendPage(page) {
      $(this.container).append('<li><a href="javascript:void(0)" class="page-stl page-num">'+page+'</a></li>')
    }

    appendActive(page) {
      $(this.container).append('<li class="active"><a href="javascript:void(0)" class="page-stl page-num">'+page+'</a></li>')
    }

    appendNode(n,i) {
      if(n === i) { this.appendActive(i) } else { this.appendPage(i) }
    }

    pevent() {
      let _this = this
      $(this.container).find('.page-num').click(function (){
        let val = ~~$(this).text()
        _this.reLayout(val)
        if(val===1) {
          $(_this.container).find('.prev-wrapper').addClass('disabled')
        } 
        if(val === _this.pages) {
          $(_this.container).find('.next-wrapper').addClass('disabled')
        }
        _this.cb(val)
      })

      $(this.container).find('.page-prev').click(() => {
        let val = $(this.container).find('.active').text()-1
        if(val<1) {
          return
        }
        this.reLayout(val)
        if(val === 1) {
          $(this.container).find('.prev-wrapper').addClass('disabled')
        }
        this.cb(val)
      })

      $(this.container).find('.page-next').click(() => {
        let val = ~~$(this.container).find('.active').text() + 1
        if(val > this.pages) {
          return
        }
        this.reLayout(val)
        if(val === this.pages) {
          $(this.container).find('.next-wrapper').addClass('disabled')
        }
        this.cb(val)
      })

      $('#jump-page').on('keydown',(e) => {
        if(e.keyCode === 13) {
          let val = ~~$('#jump-page').val()
          if(val>this.pages || val===0) {
            $('#jump-page').val('')
            return
          }
          this.reLayout(val)
          this.cb(val)
        }
      })
    }
  }


  /**
   * highlight 初始化
   */
  hljs.configure({useBR: false});

  $('pre').each(function(i, block) {
    hljs.highlightBlock(block);
  });
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
        comments = responseData.data.comments.reverse()
        
        // 清空评论区
        $('#messageContent').val('')
        
        // 评论数更新
        commentsNum.text(comments.length)
        
        // 评论分页更新
        let pages = Math.ceil(comments.length/limit)
        pagenation = new Pagenation({
          container: '.pagenation',
          pages: pages,
          limit: limit
        },renderComment)
        // 评论内容更新
        renderComment(1)
      }
    })
  })





  // 评论内容渲染
  function renderComment(num) {
    let messageList = $('.messageList')
    let pages = pagenation.pages
    let temp,start,end
    let html = ''
    if(pages===1){
      temp = comments.slice(0)
    } else if(num===pages) {
      start = (pages - 1) * 10
      temp = comments.slice(start)
    } else {
      start = (num - 1) * 10
      end = start + 10
      temp = comments.slice(start,end)
    }
    for (let val in temp) {
      html += 
        `<div class='messageBox'>
          <div class='message-header>
            <a class='message-user'>
              <span class='message-username'>${temp[val].username}</span>
            </a>
            <span class='message-addTime'>${temp[val].addFormateTime}</span>
          </div>
          <div class='message-content'>
            <p class='message-detail'>${temp[val].content}</p>
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
      comments = responseData.data.reverse()

      let pages = Math.ceil(comments.length/limit)
      pagenation = new Pagenation({
        container: '.pagenation',
        pages: pages,
        limit: limit
      },renderComment)
      renderComment(1)
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