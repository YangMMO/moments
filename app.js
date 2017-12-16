// TODO: 用户名称需修改为自己的名称
var userName = 'MMO毛毛';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和',
    avatar: './img/avatar2.png'
  },
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');
var $body = $(document.body);
var $window = $(window);
var $replyPanel = $('.reply-panel');
var $curIndex;

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容/回复内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 * datetime 2017-12-16 02:25:46
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    if (comment.my === true) {
      htmlText.push('<div class="comment-item">');
      htmlText.push('<a class="reply-my" href="#">' + userName + '</a>');
      htmlText.push(' 回复 ' + '<a class="reply-who" href="#">' + comment.obj + '</a>：');
      htmlText.push(comment.text + '</div>')
    } else {
      htmlText.push('<div class="comment-item">');
      htmlText.push('<a class="reply-who" href="#">' + comment.author + '</a>：');
      htmlText.push(comment.text + '</div>')
    }
  }
  htmlText.push('</div>');
  return htmlText.join('');
}

/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">'); //三角
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 * @datetime 2017-12-15
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  if (pics.length <= 1) {
    htmlText.push('<img class="item-only-img curPic" src="' + pics + '">');
  } else {
    for (var i = 0, len = pics.length; i < len; i++) {
      htmlText.push('<img class="pic-item  curPic" src="' + pics[i] + '">');
    }
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 分享消息模板
 * [shareTpl description]
 * @return {[type]} [description]
 */
function shareTpl(share) {
  var htmlText = [];
  htmlText.push('<div class="item-share">')
  htmlText.push('<img class="share-img" src="' + share.pic + '">');
  htmlText.push('<a href="#" class="share-tt">' + share.text + '</a>');
  htmlText.push('</div>');
  return htmlText.join('')
}
/**
 * 循环：消息体
 * @param {Object} messageData 对象
 */
function messageTpl(messageData, objIndex) {
  var user = messageData.user;
  var content = messageData.content;
  var reply = messageData.reply;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="' + objIndex+ '">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareTpl(content.share)
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
      rmReply();
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn"  data-hasLiked="'+reply.hasLiked+'">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 * @datetime 2017-12-10
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var renderArr = [];
  for (var i = data.length - 1; i >= 0; i--) {
    var messageHtml = messageTpl(data[i], i);
    renderArr.push(messageHtml);
  }
  return $momentsList.html(renderArr.reverse());
}
/**
 * 页面绑定事件函数：bindEvent
 * datatime：2017-12-13 00:01:40
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
  //定位reply位置


  //事件区
  //window点击事件
  //2017-12-14 09:37:32
  var curIndex = [];
  var idx ;
  var picSrc;

  $window.on('touchend', function(event) {
    var target = event.target;
    var $clickBtn = $(target);

    if ($('.comments').outerHeight() > 0) {
      $('.comments').removeClass('comments-cur');
    }

    if ($clickBtn.hasClass('reply-panel-like') || $clickBtn.parents('.reply-panel-like').hasClass('reply-panel-like')) {
      setTimeout(clearAll,300);
      return;
    }
    clearAll();
  })

  //图片点击事件
  //datetime 2017-12-15 23:32:08
  $body.on('touchend', '.curPic', function() {
    var $thisPic = $(this);
    var $curPic = $('.pic-bg');
    var picSrc = $thisPic.attr('src');

    $curPic.css({
      'display': 'block',
      'background-image': 'url(' + picSrc + ')'
    })

    return false;
  })

  $body.on('touchend', '.pic-bg', function() {
    $(this).css({
      'display': 'none'
    })
    return false;
  })


  //评论回复事件
  //2017-12-15 23:31:25
  $body.on('touchend', '.comment-item', function() {
    var $this = $(this);
    var $commentsText = $('.comments-text');
    var $comments = $('.comments');
    var $thisName = $(this).find('.reply-who').text();

    if ($thisName === userName) {
      return false;
    }

    $comments.addClass('comments-cur');
    setTimeout(clearAll,300);
    $commentsText.focus();
    $commentsText.attr('placeholder', '回复 @' + $thisName );
    idx = parseInt($this.parents('.moments-item').attr('data-index'));

    return false;
  })


  //*评论点击事件
  //2017-12-15 23:31:29
  $body.on('touchend', '.reply-panel-comment', function() {
    var $this = $(this);
    var $commentsText = $('.comments-text');
    var $comments = $('.comments');

    $comments.addClass('comments-cur');
    setTimeout(clearAll,300);
    $commentsText.attr('placeholder', '评论')
    $commentsText.focus();

    return false;
  })

  //发送按钮事件
  //2017-12-15 23:31:32
  $body.on('touchend', '.comments-btn', function(event) {
    var $comments = $('.comments');
    var $moments = $('.moments-item').eq(idx);
    var $commentsText = $('.comments-text');
    var dataComments = data[idx].reply.comments;
    var dataObj = {author: userName, text: $commentsText.val()};
    var placeholderObj = $commentsText.attr('placeholder');
    var placeholderObjText = placeholderObj.split('回复 @').join('');
    var placeholder = $commentsText.attr('placeholder').indexOf('回复 @');

    if($commentsText.val() === '') {//无内容情况
      $commentsText.addClass('comments-not');
      return false;
    } else if (placeholder === 0) { //回复内容
      dataObj["my"] = true;
      dataObj["obj"] = placeholderObjText;
      dataComments.push(dataObj);
    } else {//兜底
      $commentsText.removeClass('comments-not');
      dataComments.push(dataObj);
    }

    $moments.find('.reply-zone').remove();
    $moments.find('.item-ft').after(replyTpl(data[idx].reply));
    $commentsText.val('')
    $comments.removeClass('comments-cur');

    return false;
  })

  //输入框事件
  //2017-12-14 23:39:54
  $body.on('touchend', '.comments-text', function(event) {
    return false;
  })

  $body.on('touchend', '.comments-text', function(event) {
    var $commentsText = $('.comments-text');
    $commentsText.removeClass('comments-not');
    return false;
  })

  $body.on('touchend', '.comments-text', function(event) {
    var keyCode = event.keyCode;

    if (keyCode === 13) {
      $('.comments-btn').click();
    }
  })

  //*点赞点击事件
  //2017-12-14 09:37:19
  $body.on('touchend', '.reply-panel-like', function() {
    var $moments = $('.moments-item').eq(idx);
    var $replyPanel = $('reply-panel');
    idx = parseInt(curIndex.join(''));
    var linked = data[idx].reply.hasLiked;

    if(linked == false) {
      data[idx].reply.hasLiked = true;
      data[idx].reply.likes.push(userName)
      $('.reply-panel').find('span:eq(0)').text('取消');
      $moments.find('.reply-zone').remove();
      $moments.find('.item-ft').after(replyTpl(data[idx].reply));
    } else {
      $('.reply-panel').find('span:eq(0)').text('点赞');
      data[idx].reply.hasLiked = false;
      data[idx].reply.likes.pop();
      $moments.find('.reply-zone').remove();
      $moments.find('.item-ft').after(replyTpl(data[idx].reply));
      rmReply();
    }

  })

  //点赞评论面板事件
  //2017-12-14 09:37:25
  $body.on('touchend', '.item-reply-btn',  function(){
    var $comments = $('.comments');
    var $replyPanel = $('.reply-panel');
    var $curBtn = $(this);
    var position = $(this).offset();
    idx = parseInt($curBtn.parents('.moments-item').attr('data-index'));

    $comments.removeClass('comments-cur');

    function curClick(){
      $curBtn.addClass('cur');
      $replyPanel.addClass('reply-cur');
      $replyPanel.css({
        'right': $('.item-reply-btn').outerWidth() + 10 + $page.offset().left,
        'top': position.top
      })
    }

    for(var i = 0; i < data.length; i++) {
      if (idx === i) {
        var momentsData = data[i];
        if (momentsData.reply.hasLiked) {
          $('.reply-panel').find('span:eq(0)').text('取消');
        } else {
          $('.reply-panel').find('span:eq(0)').text('点赞');
        }
      }
    }

    //点击判断
    //2017-12-13 00:02:50
    if ($curBtn.hasClass('cur')) {
      clearAll();
    } else {
      if ($replyPanel.hasClass('reply-cur')) {
      clearAll();
      setTimeout(curClick, 300);
      } else {
        curClick();
      }
    }

    curIndex.splice(0, 1, $curBtn.parents('.moments-item').attr('data-index'));
    return false;
  })

}

/**
 * 用户名称: myUsreName
 * @datetime 2017-12-10
 */
function myUsreName() {
  return $page.find('.user-name').html(userName);
}
/**
 * 评论检查: rmReply
 * @datetime 2017-12-10
 */
function rmReply() {
  var $replyZone = $('.reply-zone');
  for (var i = 0; i < $replyZone.length; i++) {
    if($replyZone[i].textContent === '') {
      $replyZone[i].remove();
    }
  }
}
//函数区
//清除class
//2017-12-13 00:02:55
  function clearAll(){
    $momentsList.find('.cur').removeClass('cur');
    $momentsList.find('.reply-cur').removeClass('reply-cur');
  }
/**
 * 点赞评论面板
 * @datetime 2017-12-10
 */
function replyPanel(elem) {
  var itemArr = [];
  itemArr.push('<ul class="reply-panel">');
  itemArr.push('<li class="reply-panel-like"><i class="icon-like"></i><span>点赞</span></li>');
  itemArr.push('<li class="reply-panel-comment"><i class="icon-comment"></i><span>评论</span></li>');
  itemArr.push('</ul>');
  return elem.prepend(itemArr.join(''));
}
/**
 * 评论输入面板
 * @datetime 2017-12-10
 */
function replyComment(elem) {
  var itemArr = [];
  itemArr.push('<footer class="comments">');
  itemArr.push('<input type="text" placeholder="评论" class="comments-text">');
  itemArr.push('<input type="submit" value="发送" class="comments-btn">');
  itemArr.push('</footer>');
  return elem.append(itemArr.join(''));
}
function curPic(elem){
  var itemArr = [];
  itemArr.push('<div class="pic-bg"></div>');
  return elem.append(itemArr.join(''));
}
/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  myUsreName();
  render();
  bindEvent();
  rmReply();
  replyPanel($momentsList);
  replyComment($momentsList);
  curPic($momentsList);
}

init();