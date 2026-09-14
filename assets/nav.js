/* =========================================================================
 *  nav.js —— 站点页 / 真相页共享脚本（《乌石》）
 *
 *  三条铁律：
 *   ① 正文里的关键词**只加粗，不可点**（不绑点击、不加手型、不给 title）。
 *      玩家必须自己把词打进浏览器搜索框 —— 页面里没有任何"关键词链接"。
 *   ② 站内导航（顶部栏目 / 栏目页 / 正文 / 侧栏 / 页脚）按正常网站方式
 *      **同标签页**跳转，只在本站内；整站不放"相关链接 / 相关站点"推荐块。
 *   ③ 页面载入时把"当前节点"上报到 localStorage，供探索地图与进度同步。
 *      ?node= 由浏览器注入；无参数时按 文件+锚点 唯一匹配兜底。
 * ========================================================================= */
(function(){
  "use strict";

  var SAVE_KEY = 'wushi_v1';

  /* 页面 → 节点 id（与 browser.html / map.html 保持一致） */
  var PAGE_ROUTE = {
    S_HOME:['index.html',''],
    S_GOV:['sites/gov/index.html',''], S_GOV_OPEN:['sites/gov/open.html',''], S_GOV_TENDER:['sites/gov/tender.html',''],
    S_GOV_PERMIT:['sites/gov/permit.html',''], S_GOV_HOTLINE:['sites/gov/hotline.html',''],
    S_GOV_PETITION:['sites/gov/petition.html',''], S_GOV_CADRE:['sites/gov/cadre.html',''], S_GOV_ABOUT:['sites/gov/about.html',''],
    S_NEWS:['sites/news/index.html',''], S_NEWS_LOCAL:['sites/news/local.html',''], S_NEWS_OLD:['sites/news/oldnews.html',''],
    S_NEWS_PHOTO:['sites/news/photos.html',''], S_NEWS_CULT:['sites/news/culture.html',''], S_NEWS_WX:['sites/news/weather.html',''],
    S_NEWS_T311:['sites/news/art-t311.html',''], S_NEWS_MERGE:['sites/news/art-merge.html',''],
    S_NEWS_HALL:['sites/news/art-hall.html',''], S_NEWS_ABOUT:['sites/news/about.html',''],
    S_FORUM:['sites/forum/index.html',''], S_FORUM_BOARD:['sites/forum/board.html',''], S_FORUM_T1:['sites/forum/t1.html',''],
    S_FORUM_T2:['sites/forum/t2.html',''], S_FORUM_T3:['sites/forum/t3.html',''],
    S_FORUM_NOTICE:['sites/forum/notice.html',''], S_FORUM_RULES:['sites/forum/rules.html',''],
    S_TIEBA:['sites/tieba/index.html',''], S_TIEBA_T1:['sites/tieba/t1.html',''], S_TIEBA_T2:['sites/tieba/t2.html',''],
    S_TIEBA_T3:['sites/tieba/t3.html',''], S_TIEBA_GONE:['sites/tieba/gone.html',''], S_TIEBA_ABOUT:['sites/tieba/about.html',''],
    S_WX:['sites/wx/index.html',''], S_WX_A1:['sites/wx/a1.html',''], S_WX_A2:['sites/wx/a2.html',''],
    S_WX_A3:['sites/wx/a3.html',''], S_WX_DEAD:['sites/wx/dead.html',''], S_WX_ABOUT:['sites/wx/about.html',''],
    S_MAP:['sites/map/index.html',''], S_MAP_HALL:['sites/map/poi-hall.html',''],
    S_MAP_SCHOOL:['sites/map/poi-school.html',''], S_MAP_ROUTE:['sites/map/route.html',''],
    S_MK:['sites/market/index.html',''], S_MK_ITEM:['sites/market/item-token.html',''], S_MK_SELLER:['sites/market/seller.html',''],
    S_MK_REL:['sites/market/related.html',''], S_MK_CHAT:['sites/market/chat.html',''],
    S_VID:['sites/video/index.html',''], S_VID_0311:['sites/video/v0311.html',''],
    S_VID_LIVE:['sites/video/live.html',''], S_VID_CMT:['sites/video/comments.html',''],
    S_LIFE:['sites/life/index.html',''], S_LIFE_SHOP:['sites/life/shop.html',''],
    S_LIFE_CLOSED:['sites/life/closed.html',''], S_LIFE_FOOD:['sites/life/food.html',''], S_LIFE_ABOUT:['sites/life/about.html',''],
    S_JOB:['sites/job/index.html',''], S_JOB_CO:['sites/job/company.html',''], S_JOB_ABOUT:['sites/job/about.html',''],
    S_HOUSE:['sites/house/index.html',''], S_HOUSE_XQ:['sites/house/xiaoqu.html',''], S_HOUSE_ABOUT:['sites/house/about.html',''],
    S_LOGI:['sites/logi/index.html',''], S_LOGI_TRK:['sites/logi/track.html',''],
    S_EDU:['sites/edu/index.html',''], S_EDU_HIS:['sites/edu/history.html',''], S_EDU_ALUM:['sites/edu/alumni.html',''], S_EDU_ABOUT:['sites/edu/about.html',''],
    S_LIB:['sites/lib/index.html',''], S_LIB_CHI:['sites/lib/chihzi.html',''], S_LIB_CAT:['sites/lib/catalog.html',''],
    S_LIB_ARC:['sites/lib/archive.html',''], S_LIB_ABOUT:['sites/lib/about.html',''],
    S_MEM:['sites/mem/index.html',''], S_MEM_MSG:['sites/mem/msg.html',''], S_MEM_ABOUT:['sites/mem/about.html',''],
    S_SVC:['sites/svc/index.html',''], S_SVC_SB:['sites/svc/shebao.html',''], S_SVC_GJJ:['sites/svc/gongjijin.html',''],
    S_SVC_YY:['sites/svc/yiyuan.html',''], S_SVC_XJ:['sites/svc/xueji.html',''], S_SVC_MZ:['sites/svc/minzheng.html',''],
    S_BLOG:['sites/blog/index.html',''], S_BLOG_311:['sites/blog/p-311.html',''], S_BLOG_TOK:['sites/blog/p-token.html',''],
    S_BLOG_TOWN:['sites/blog/p-town.html',''], S_BLOG_NAME:['sites/blog/p-name.html',''],
    S_BLOG_MEM:['sites/blog/p-mem.html',''], S_BLOG_ABOUT:['sites/blog/about.html',''],
    T01:['truth/act1/t01-token.html',''], T02:['truth/act1/t02-seller.html',''], T03:['truth/act1/t03-woodwork.html',''], T04:['truth/act1/t04-wiki.html',''],
    T05:['truth/act2/t05-chihzi.html',''], T06:['truth/act2/t06-merge.html',''], T07:['truth/act2/t07-poi.html',''], T08:['truth/act2/t08-hydro.html',''],
    T09:['truth/act2/t09-dialect.html',''], T10:['truth/act2/t10-album.html',''], T11:['truth/act2/t11-deadwx.html',''],
    T12:['truth/act3/t12-news311.html',''], T13:['truth/act3/t13-list.html',''], T14:['truth/act3/t14-missing.html',''], T15:['truth/act3/t15-staff.html',''],
    T16:['truth/act3/t16-post.html',''], T17:['truth/act3/t17-tieba.html',''], T18:['truth/act3/t18-video.html',''], T19:['truth/act3/t19-org.html',''],
    T20:['truth/act4/t20-sutra.html',''], T21:['truth/act4/t21-liu.html',''], T22:['truth/act4/t22-rite.html',''], T23:['truth/act4/t23-key.html',''],
    T24:['truth/act4/t24-cadre.html',''], T25:['truth/act4/t25-hotline.html',''], T26:['truth/act4/t26-petition.html',''], T27:['truth/act4/t27-memorial.html',''],
    T28:['truth/act4/t28-notice.html',''], T29:['truth/act4/t29-admin.html',''], T30:['truth/act4/t30-court.html',''],
    T31:['truth/act5/t31-satellite.html',''], T32:['truth/act5/t32-drive.html',''], T33:['truth/act5/t33-sheet.html',''], T34:['truth/act5/t34-tape.html',''],
    T35:['truth/act5/t35-bell.html',''], T36:['truth/act5/t36-related.html',''], T37:['truth/act5/t37-permit.html',''], T38:['truth/act5/t38-access.html',''],
    T39:['truth/act5/t39-mail.html',''], T40:['truth/act5/t40-call.html',''],
    T41:['truth/act6/t41-44.html',''], T42:['truth/act6/t42-route.html',''], T43:['truth/act6/t43-blog.html',''], T44:['truth/act6/t44-line.html',''],
    T45:['truth/act6/t45-file.html',''], T46:['truth/act6/t46-keykeeper.html',''], T47:['truth/act6/t47-final.html','']
  };

  /* 站点目录 → 站点节点（进入站点任意一页即点亮该站） */
  var SITE_BY_DIR = {
    gov:'S_GOV', news:'S_NEWS', forum:'S_FORUM', tieba:'S_TIEBA', wx:'S_WX', map:'S_MAP',
    market:'S_MK', video:'S_VID', life:'S_LIFE', job:'S_JOB', house:'S_HOUSE', logi:'S_LOGI',
    edu:'S_EDU', lib:'S_LIB', mem:'S_MEM', svc:'S_SVC', blog:'S_BLOG'
  };

  /* 计算页面到项目根目录的相对前缀（本文件固定在 <root>/assets/nav.js） */
  var SELF_SRC = (function(){ try{ return document.currentScript ? document.currentScript.src : ''; }catch(e){ return ''; } })();
  var ROOT_PATH = (function(){
    try{ return SELF_SRC ? new URL(SELF_SRC).pathname.replace(/assets\/nav\.js$/,'') : ''; }catch(e){ return ''; }
  })();
  function relPath(){
    try{ if(ROOT_PATH && location.pathname.indexOf(ROOT_PATH) === 0) return location.pathname.slice(ROOT_PATH.length); }catch(e){}
    return location.pathname.split('/').pop();
  }
  var ROOT_PREFIX = (function(){
    var r = relPath(), depth = r.split('/').length - 1, out = '';
    for(var i=0;i<depth;i++) out += '../';
    return out;
  })();
  function browserUrl(q){
    return ROOT_PREFIX + 'browser.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
  }

  /* 随幕失效的背景词：页面上同步显示为已移除（与浏览器索引一致） */
  var ACT_RANGE=[[1,4],[5,11],[12,19],[20,30],[31,40],[41,47]];
  var EXPIRED_WORDS={"县长信箱":4,"沅川日报":5,"沅川论坛":3,"柳津发布":5,"柳津公众号说明":6,"柳津地图":3,"柳津街景":5,"沅川短视频":5,"柳津点评":4,"柳津美食":5,"沅川人才网":4,"柳津房产网":3,"柳津二手房":5,"柳津快递":7,"柳津政务服务网":6,"柳津社保":6,"柳津人民医院":6,"柳津学籍查询":6,"网上纪念馆":4,"江边旧事":6,"柳津政务公开目录":6,"柳津住建局":6,"柳津中标公告":6,"柳津流标公告":6,"沅川论坛灌水区":4,"柳津杂谈":6,"沅川论坛版规":5,"柳津热帖":6,"柳津老照片帖子":7,"柳津吧规":5,"乌石吧存档":6,"柳津卫星图":7,"乌石礼堂旧址":6,"柳津驿站":7,"柳津老照片":6,"柳津旧报纸":5,"柳津副刊":6,"柳津天气":5,"柳溪河水位":6,"柳津面馆":6,"柳津民宿":6,"柳津企业查询":6,"柳津招聘":5,"柳津发布历史消息":7,"柳津公众号":6,"柳津镇人民政府":6,"柳津卫生院":7,"柳津社会组织":6,"柳津县志":6,"柳津镇中心校":6,"柳津二中招生":6,"柳津校友录":6,"柳津校史":6,"柳津纪念页":6,"柳津寻人":7,"柳津寻人启事":7,"柳津二手":5,"柳津旧木牌":7,
    /* 站点名：软失效——过期后仍可打开，但正文里一律划掉、标为已移除 */
    "柳津县人民政府":6,"柳津县政府":6,"柳津贴吧":4,"沅川闲置":5,"柳津二中":6,"柳津图书馆":6,"柳津档案馆":6};
  function curAct(){
    try{ var raw=localStorage.getItem(SAVE_KEY); if(!raw) return 0;
      var d=JSON.parse(raw), a=0;
      (d.f||[]).forEach(function(id){ var m=/^T(\d+)$/.exec(id); if(!m) return; var n=+m[1];
        for(var i=0;i<ACT_RANGE.length;i++){ var r=ACT_RANGE[i];
          if(n>=r[0]&&n<=r[1]){ if(i+1>a) a=i+1; break; } } });
      return a;
    }catch(e){ return 0; }
  }
  /* 软失效的视觉：划掉 + 变淡 + 一个「⌀」记号。
   * 由 nav.js 注入，站点页与真相页共用，保证全站一致。 */
  function injectGoneStyle(){
    if(document.getElementById('gone-style')) return;
    var s=document.createElement('style'); s.id='gone-style';
    s.textContent =
      '.kw.gone,span.gone{text-decoration:line-through;text-decoration-thickness:1px;opacity:.4;}'+
      '.kw.gone::after,span.gone::after{content:" ⌀";font-size:.72em;opacity:.85;text-decoration:none;display:inline-block;}';
    document.head.appendChild(s);
  }
  function markExpired(){
    var a=curAct(); if(!a) return;
    injectGoneStyle();
    document.querySelectorAll('.kw, .hitkw b').forEach(function(el){
      var w=(el.textContent||'').trim(), u=EXPIRED_WORDS[w];
      if(u && a>=u){ el.classList.add('gone'); el.setAttribute('title',''); }
    });
    /* 页脚导航 / 来源行里的裸站名：整段文本等于失效词时，包一层 span.gone */
    var walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var targets=[];
    while(walker.nextNode()){
      var n=walker.currentNode, t=(n.nodeValue||'').trim();
      if(!t || t.length>12) continue;
      var u2=EXPIRED_WORDS[t]; if(!u2 || a<u2) continue;
      var p=n.parentNode;
      if(!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) continue;
      if(p.classList && p.classList.contains('gone')) continue;
      targets.push(n);
    }
    targets.forEach(function(n){
      var sp=document.createElement('span'); sp.className='gone'; sp.textContent=n.nodeValue;
      n.parentNode.replaceChild(sp,n);
    });
  }

  function register(id){
    if(!id) return;
    try{
      var raw = localStorage.getItem(SAVE_KEY);
      var d = raw ? JSON.parse(raw) : {f:[], l:[]};
      if(!Array.isArray(d.f)) d.f = [];
      if(d.f.indexOf(id) === -1){ d.f.push(id); localStorage.setItem(SAVE_KEY, JSON.stringify(d)); }
    }catch(e){}
  }

  /* 底部"回到浏览器"用；站内其它地方不调用 */
  window.go = function(){ window.open(browserUrl(''), '_blank', 'noopener'); };
  window.backHome = window.go;
  window.picMiss = function(img){
    if(!img) return;
    var w = img.closest ? img.closest('.thumb,.fig,.mth,.cv,figure') : null;
    (w || img).style.display = 'none';
  };

  function init(){
    /* 1) 精确节点：浏览器注入的 ?node= */
    var node = null;
    try{ node = new URLSearchParams(location.search).get('node'); }catch(e){}
    if(!node){
      /* 退化匹配：文件唯一对应某节点时才上报，避免误报 */
      var here = relPath(), hash = location.hash.slice(1), matches = [];
      for(var id in PAGE_ROUTE){
        var rt = PAGE_ROUTE[id]; if(!rt) continue;
        if(rt[0] === here && (rt[1] || '') === hash) matches.push(id);
      }
      if(matches.length === 1) node = matches[0];
    }
    register(node);

    /* 2) 站点节点：进入站内任意一页即点亮该站 */
    var parts = relPath().split('/'); parts.pop();
    var lastDir = parts[parts.length - 1];
    if(SITE_BY_DIR[lastDir]) register(SITE_BY_DIR[lastDir]);

    /* 3) 正文关键词：只加粗，**不绑任何点击**、不加手型、不发 title。
     *    顺手清掉页面里可能残留的内联手型样式。 */
    markExpired();

    document.querySelectorAll('.kw').forEach(function(el){
      el.style.cursor = 'default';
      el.removeAttribute('title');
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
