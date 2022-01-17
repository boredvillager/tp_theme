var full_size_width = 920;

// try{$()}catch(e){ // 这是什么NT代码！！焯！！！
//     let s = document.createElement('script');
//     s.src = '//libs.baidu.com/jquery/1.8.3/jquery.min.js';
//     document.body.append(s);
//     s.onload = function(){
//         $("script").each(function(){
//             $.getScript($(this).attr('src'));
//         });
//     }
// }

$(function(){
    $("#pagecover").fadeOut();
});
PostbirdImgGlass.init({ // 图像放大
    domSelector: ".post-content img:not([unzoomable])",
    animation: true
});
$(".post-thumb img").lazyload();
$(".post-content img").lazyload();

function safe_do(fn){
    try{fn()}catch{console.error('Error when executing: '+fn.toString())};
}


function emoji_add(selector, facenamereplace, facecls, prefix = "tbbq-face"){ // 表情管理 评论区插入+自动替换
    facereplace = [];
    for (var i = 0; i < facenamereplace.length; i++){
        facereplace[i] = prefix + "_" + i;
    }
    if ($(selector).length > 0) {
        for (var i = 0; i < facenamereplace.length; i++) {
            $(selector)[0].innerHTML += '‹'+facenamereplace[i]+'›';
        }
    }
    function showFaces(dom, cls, callback){
        if (dom.length > 0){
            var bodyhtml = dom.html();
            for (var i = 0; i < facereplace.length; i++) {
                bodyhtml = bodyhtml.replace(new RegExp('(‹|：)'+facenamereplace[i]+'(›|：)',"g"),
                    "<i class='emojis " + facecls + " "+cls+" "+facereplace[i]+"' draggable='false' alt='😀' num='"+i+"'></i>");
            }
            dom.html(bodyhtml);
            callback();
        }
    }
    showFaces($('#comments'), '', function(){
        $(selector+" .emojis").each(function(){
            $(this).attr('onclick', // 添加onclick防止事件丢失
            'insertText( $("textarea[name=text]")[0], \'‹'+facenamereplace[$(this).attr('num')]+'›\' );');
        })
    });
    showFaces($("#rctrly"), 'tiny', function(){});
}

emoji_add('#showfacenamereplace_tbbq', ["滑稽","喷","彩虹","阴险","怒","笑眼","黑线","玫瑰","乖","汗",
"惊哭","酷","狂汗","冷","真棒","不高兴","大哭","咖啡","yeah","ojbk"], "tbbq", "tbbq-face");
emoji_add('#showfacenamereplace_wpbq', ['→', '开心', '疑惑', '很酷', '哭泣', '咿呀', '恶魔', '!!!',
'idea', '哄堂大笑', '生气', '绿笑脸', '面无表情', '问号', '吐舌头', '脸红', '白眼', '伤心', '微笑', 
'惊讶', '恶魔坏笑', 'wink'], "wpbq", "wpbq-face");

// 点击打开表情
$('.click_to_show').each(function(){
    $(this).children('.click_board').each(function(){
        var dom = $('#'+$(this).attr('for'));
        dom.click(function(){
            $(this).fadeOut(100);
        });
        $(this).click(function(){
            dom.fadeIn(100);
        });
    });
});

// 插入表情完毕之后再计算高度，防止插入表情后高度变化
function autoresize(){
    if ($(window).width() > full_size_width) {
        safe_do(function(){
            var sb_height = Math.max($(".sb-left").height(), $(".sb-right").height());
            $(".atcs").css("min-height", sb_height);
        });
    }
    safe_do(function(){
        if ($('#comments').length > 0){
            if ($(window).width() < 500){
                $('#comments').parent('.post').css('padding', 0);
            }else{
                $('#comments').parent('.post')[0].style = '';
            }
        }
    });
    safe_do(function(){
        if ($(".post-meta").length > 0){
            $(".post-meta").css("width", $(".atcs").width());
        }
    });
    // 顶部导航栏
    safe_do(function(){
        let gap = $('.top-nav').height() + $('.sb-holder').height() + 1; // 我也不知道为什么要加1
        $('.head').css('padding-bottom', gap + 'px');
        $('.body').css('top', (-gap) + 'px');
    });
}
autoresize();
window.onresize = autoresize;

$(".backtotop").click(function () {
    var speed = 200;
    $('body,html').animate({ scrollTop: 0 }, speed);
    return false;
});

// 评论区添加表情
function insertText(obj, str){
	var m = obj.value.match(/(‹|：)[\S]{2,5}?(›|：)/g);
	if (m) {
		if (m.length > 8) {
			alert("最多添加8个表情！");
			return false;
		}
	}
	obj.value += str;
}

// 代码高亮简单实现
// 红色
var HL_KW = ['and', 'as', 'assert', 'break', 'case', 'catch', 'classdef', 'continue', 'die', 'del',
'do', 'else', 'elseif', 'endfor', 'endforeach', 'endif', 'elif', 'endswitch',
'except', 'endwhile', 'eval', 'exit', 'finally', 'False',
'for', 'from', 'foreach', 'global', 'goto', 'if', 'in', 'is', 'import', 'include', 'lambda',
'not', 'None', 'new', 'namespace', 'or', 'private', 'pass', 'public', 'protected', 'require', 'static',
'return', 'raise', 'switch', 'throw', 'try', 'True', 'var', 'with', 'while', 'xor', 'yield'];
HL_KW = new RegExp('\\b('+HL_KW.join('|')+')\\b', 'ig');
// 蓝色 有括号调用的已经默认自动变蓝了
var HL_KF = [
// js
'function',
// python
'def', 'print',
// ternimal - linux
'echo', 'exec', 'vim', 'vi', 'screen', 'ls', 'cd', 'pwd', 'mkdir', 'cp', 'mv', 'rm', 'df', 'du', 'cat', 'clear', 'grep',
'reboot', 'shutdown', 'basename', 'dirname', 'export', 'read', 'test', 'who', 'tee', 'unset', 'chmod',
'find', 'tar', 'gzip', 'rmdir', 'kill', 'crontab', 'service', 'free', 'top', 'chown', 'sudo', 'passwd',
'tail', 'diff', 'scp', 'telnet', 'wget', 'ifconfig', 'whereis', 'locate', 'date', 'route', 'iptables', 
'pip', 'pip2', 'pip3', 'python', 'python2', 'python3', 'apt', 'apt-get', 'pkg', 'yum', 'pacman', 'git', 'cmake',
'make',
// matlab
'meshgrid', 'axis', 'hold', 'grid', 'plot', 'surf', 'mesh', 'gca', 'gcf', 'gco', 'set'
];
HL_KF = new RegExp('\\b('+HL_KF.join('|')+')\\b', 'ig');

$("pre code").each(function(){
    this.innerHTML = this.innerHTML.replace(/((["'])(?:\\.|[^\\\n])*?\2)/ig,"<span class='hl-str'>$1</span>").replace(/(\\[\s\S])/ig,"<span class='hl-warn'>$1</span>").replace(/(\/\*[\s\S]+\*\/)/g,"<span class='hl-note'>$1</span>").replace(/(~\/| -{1,2}[a-z&;]{1,}[ :\n\r]|!|\^|\+|\*|%|\||&amp;|===|==|-&gt;|=&gt;)/ig,"<span class='hl-fh'>$1</span>").replace(/([^a-z0-9_]|^)([\d\.]+)([^a-z0-9_]|$)/ig,"$1<span class='hl-num'>$2</span>$3").replace(/([^a-z0-9_]|^)([\d\.]+)([^a-z0-9_]|$)/ig,"$1<span class='hl-num'>$2</span>$3").replace(HL_KW, "<span class='hl-kw'>$1</span>").replace(/((?=^|\n|\r| )\s*(\/\/|#).*(?=\r|\n|$))/g,"<span class='hl-note'>$1</span>").replace(HL_KF,"<span class='hl-kf'>$1</span>").replace(/\b((?![0-9])[\w0-9]+(?=\())/ig,"<span class='hl-kf'>$1</span>").replace(/(\$(?![0-9])[\w0-9]+\b)/ig, "<span class='hl-var'>$1</span>");
});

$('.post-thumb img').each(function(){
    this.onerror = function(){
        $(this).attr("src", themeUrl+"/s/img/error.jpg");
    }
});



// 评论区头像旋转
$('.avatar').each(function(){
    var delay = Math.random()*50;  var speed = 600 + Math.random() * 100;
    $(this).css({'animation': 'spin '+speed+'s infinite linear', 'animation-delay': delay+'s'});
});

// 评论区显示@
$('.comment-children .comment-content').each(function(){
    var id = $(this).parents('.comment-body').parents('.comment-children').parents('.comment-body').attr('id');
    var id = $('#'+id+' span[title=author]').eq(0).text();
    id = id.replace(/(^[\s ]+)|([\s ]+$)/g, '');
    var num = $(this).parents('.comment-body').length - 1;
    if (id){
        $(this).html('['+num+'层]'+' 回复 <a>@'+id+'</a>: '+$(this).html());
    }
});


/* 阅读部分添加导航 */
if ($('.post-content').length == 1){
    // 建创悬浮窗口
    var navdom = $('<div id="level-nav"></div>');
    navdom.append('<div class="outer">目录导航</div>');
    var contentDom = $('<ul class="ctn"></ul>');
    var titles = $('.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
    var default_rank = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    var ranks = [0, 0, 0, 0, 0, 0];
    var current_level = 0;
    for (var i = 0; i < titles.length; i++){
        this_level = default_rank.indexOf(titles[i].tagName);
        if (current_level == this_level){
            // 同一级
            ranks[current_level] += 1;
        }else if(current_level < this_level){
            // 建立下一级
            ranks[this_level] += 1;
        }else if(current_level > this_level){
            // 建立上一级
            ranks[this_level] += 1;
            // 清空其他
            for (let j = this_level + 1; j < 6; j++){
                ranks[j] = 0;
            }
        }
        current_level = this_level; // 更新current_level
        padding_text = -1;
        ranks_text = [];
        for (var j = 0; j < 6; j++){
            if (ranks[j] > 0){
                padding_text += 1;
                ranks_text.push(ranks[j]);
            }
        }
        titles_filtered = titles[i].innerText.replace(/^([0-9：:、. ])+/i, '');
        ranks_text = ranks_text.join('.');
        contentDom.append('<li><a href="#title-'+ranks_text+'" style="padding-left: '+padding_text*10+'px">'+ranks_text+'、'+titles_filtered+'</a></li>');
        $(titles[i]).append('<a name="title-'+ranks_text+'" class="title_level">#'+ranks_text+'</a>');
    }
    navdom.append(contentDom);
    if (titles.length > 5){
        $('body').append(navdom);
    }
}


// 滚动侧栏跟随
window.onscroll = function(){
    var pos = document.documentElement.scrollTop;
    var baseTop = $('.atcs').offset().top;
    var screenH = $(window).height();
    var left_height = $('.sb-left').height();
    var right_height = $('.sb-right').height();
    if ($(window).width() <= full_size_width || Math.min(left_height, right_height) < screenH) {
        $('.sb-left').removeAttr('style');
        $('.sb-right').removeAttr('style');
        return;
    }
    var reach_left = baseTop + left_height - screenH;
    var reach_right = baseTop + right_height - screenH;
    var end = $('.body').height() + $('.body').offset().top - screenH;
    var width_left = $('.body').width()*0.22;
    var width_right = $('.body').width()*0.18;
    var offset_left = $('.body').offset().left;
    var offset_right = $('.body').offset().left + $('.body').width() - width_right;
    if (pos > end){
        $('.sb-left').css({'position': 'fixed', 'bottom': pos - end,
                    'left': offset_left, 'width': width_left});
        $('.sb-right').css({'position': 'fixed', 'bottom': pos - end,
                    'left': offset_right, 'width': width_right});          
        return;
    }
    if(pos > reach_left){
        $('.sb-left').css({'position': 'fixed', 'bottom': 0,
                        'left': offset_left, 'width': width_left});
    }else{
        $('.sb-left').removeAttr('style');
    }
    if(pos > reach_right){
        $('.sb-right').css({'position': 'fixed', 'bottom': 0,
                        'left': offset_right, 'width': width_right});
    }else{
        $('.sb-right').removeAttr('style');
    }
}


// safe_do(console.clear);