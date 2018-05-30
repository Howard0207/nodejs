// Navigation Menu
$(function() {
  $('.menu .userInfo-wrapper').css({display: 'none'}) // Opera Fix
  $('.menu .userInfo').hover(function(){
    $(this).find('.userInfo-wrapper').css({visibility: 'visible',display: 'none'}).slideDown('normal')
  },function(){
    $(this).find('.userInfo-wrapper').slideUp('normal')
  })

  // laydate plugin init
  laydate.render({
    elem: '#birthday',
    format: 'yyyy-MM-dd'
  })

  // avatar edit List Show
  $('#avatar').click(function() {
    let avatar_src = $('#avatar').attr('src')
    $('#avatar-new').attr('src',avatar_src)
    $('.upload').show('normal')
  })

  // avatar edit List Hide
  $('.cancel').click(function() {
    $('.upload').hide()
  })

  // avatar select
  $('#avatar-file').on('change',function() {

    var docObj=document.getElementById('avatar-file')

    var imgObjPreview=document.getElementById('avatar-new')

    if(docObj.files &&docObj.files[0]) {
      // 判断文件格式
      if(docObj.files[0].type === 'image/jpeg' || docObj.files[0].type === 'image/png') {
        //火狐下，直接设img属性
        imgObjPreview.style.display = 'block'
        imgObjPreview.style.width = '200px'
        imgObjPreview.style.height = '200px'
        //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
        imgObjPreview.src = window.URL.createObjectURL(docObj.files[0])
      } else {
        return
      }
    } else {
      //IE下，使用滤镜
      docObj.select()
      var imgSrc = document.selection.createRange().text
      var localImagId = document.getElementById('localImag')
      //必须设置初始大小
      localImagId.style.width = '200px'
      localImagId.style.height = '200px'
      //图片异常的捕捉，防止用户修改后缀来伪造图片
      try {
        localImagId.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)'
        localImagId.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc
      }
      catch (e) {
        alert('您上传的图片格式不正确，请重新选择!')
        return false
      }
      imgObjPreview.style.display = 'none'
      document.selection.empty()
    }
  })

  // avatar - cut
  $('#avatar-cut').on('mousedown',function(e) {
    e.preventDefault()
    if(e == window.event) {
      e.cancleBubble()
    } else {
      e.stopPropagation()
    }
    let max = $('#upload-preview').width() - $('#avatar-cut').width() - 1
    let left = $('#avatar-cut').position().left,top = $('#avatar-cut').position().top
    let curL = e.clientX, curT = e.clientY

    $(document).on('mousemove',function(e) {
      e.preventDefault()
      if(e === window.event) {
        e.cancleBubble()
      } else {
        e.stopPropagation()
      }
      let actL = e.clientX,actT = e.clientY
      let newL = left + actL - curL, newT = top + actT - curT
      newL = Math.max(0,newL)
      newT = Math.max(0,newT)

      newL = Math.min(max,newL)
      newT = Math.min(max,newT)
      $('#avatar-cut').css({left: newL,top:newT})
    })
    $(document).on('mouseup',function(e) {
      e.preventDefault()
      if(e === window.event) {
        e.cancleBubble()
      } else {
        e.stopPropagation()
      }
      $(document).unbind('mousemove').unbind('mouseup')
    })
  })


  // 截取预览
  function avatarCutPreview(path) {
    let img = new Image()
    let avatarPath = $('#avatar').attr('src')
    img.src = path || avatarPath
    let canvas = document.createElement('canvas')
    canvas.width = 150
    canvas.height = 150
    let ctx = canvas.getContext('2d')
    let start = $('.avatar-cut').position().left, end = $('.avatar-cut').position().top
    img.onload = function () {
      let width = img.width, height = img.height, imgBase = null
      ctx.drawImage(img, start * width / 200, end * height / 200, 150 * width / 200, 150 * height / 200, 0, 0, canvas.width, canvas.height)
      imgBase = canvas.toDataURL('image/jpg')
      $('.upload').hide()
      $('#avatar-preview').attr('src', imgBase)
      let formdata = new FormData()
      formdata.append('avatar',imgBase)
      $.ajax({
        url:'/settings/save_avatar',
        type: 'post',
        dataType: 'json',
        data: formdata,
        cache: false,  
        processData: false,  
        contentType: false,
        success: function(res){
          if(res.code === 200) {
            $('#avatar').attr('src',imgBase)
            $('.avatar-wrapper').find('.avatar').attr('src',imgBase)
            return
          } else {
            throw new Error(res.msg)
          }
        },
        error: function(e) {
          throw new Error(e)
        }
      })
    }
  }

  $('.upload').find('.save').click(() => {
    let path = $('#avatar-new').attr('src')
    avatarCutPreview(path)
  })

  // submit for infos
  $('.submit').click(() => {
    let nickname = $('#nickname').val()
    let gender = $('input[name="gender"]:checked').val()
    let post = $('#curjob').val()
    let birthday = $('#birthday').val()
    let province = $('#s_province').val()
    let city = $('#s_city').val()
    if(gender.length > 9) {
      gender = gender.slice(0,9)
    }

    $.ajax({
      type: 'post',
      dataType: 'json',
      data: {
        nickname: nickname,
        gender: gender,
        post: post,
        birthday:birthday,
        province: province,
        city: city
      },
      success: function(res) {
        console.log(res)
      },
      error: function(e) {
        throw new Error(e)
      }
    })
  })

})