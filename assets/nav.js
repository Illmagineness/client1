/* =========================================================================
 *  nav.js —— 站点页共享脚本
 *  - 点击正文蓝色关键词 → 新标签页打开「怀安在线」并带入检索词。
 *  - 一切跨页面链接（站内外）默认新标签页打开，原网页不覆盖。
 *  - 页面载入时把"当前节点"上报到 localStorage，供探索地图/进度同步。
 *  由 browser.html 注入的 ?node= 参数决定精确节点；无参数时按 文件#锚点 推断。
 * ========================================================================= */
(function(){
  "use strict";

  /* 页面 → 节点 id（与 browser.html 的 PAGE_ROUTE 保持一致） */
  var PAGE_ROUTE = {
    /* 背景容器 */
    S_ARCHIVE:['sites/archive/index.html',''], S_ABOUT:['sites/archive/intro.html','about'],
    S_NEWS:['sites/news/index.html',''], S_TIEBA:['sites/tieba/index.html',''], S_WX:['sites/wx/index.html',''],
    S_BLOG:['sites/blog/index.html',''], B1998:['sites/web/1998.html',''], B_BBS:['sites/web/bbs.html',''],
    B_DIKE:['sites/news/index.html','dike'], B_NEWS_DIG:['sites/news/index.html','photos'], B_NEWS_REP:['sites/news/index.html','report'],
    B_TIEBA_STORY:['sites/tieba/index.html','story'],
    B_WX_DIKE:['sites/wx/index.html','dike'], B_WX_PHOTO:['sites/wx/index.html','photo'], B_WX_MEM:['sites/wx/index.html','memory'],
    B_BLOG_FERRY:['sites/blog/index.html','ferry'], B_BLOG_LAMP:['sites/blog/index.html','lamp'],
    /* 真相线：一词一页，按 Act 分目录 */
    T01:['truth/act1/t01-oldfile.html',''],   T02:['truth/act1/t02-case.html',''],        T03:['truth/act1/t03-live.html',''],
    T04:['truth/act1/t04-lamp.html',''],      T05:['truth/act1/t05-witness.html',''],     T06:['truth/act1/t06-broadcaster.html',''],
    T07:['truth/act1/t07-after.html',''],     T08:['truth/act1/t08-delete.html',''],      T09:['truth/act1/t09-rules.html',''],
    T10:['truth/act2/t10-hospital.html',''],  T11:['truth/act2/t11-clinic003.html',''],   T12:['truth/act2/t12-clinic017.html',''],
    T13:['truth/act2/t13-anon.html',''],      T14:['truth/act2/t14-doctor.html',''],      T15:['truth/act2/t15-meds.html',''],
    T16:['truth/act2/t16-hisinfo.html',''],   T17:['truth/act2/t17-lost.html',''],
    T18:['truth/act3/t18-intranet.html',''],  T19:['truth/act3/t19-log0720.html',''],     T20:['truth/act3/t20-log0721.html',''],
    T21:['truth/act3/t21-breach.html',''],    T22:['truth/act3/t22-report.html',''],      T23:['truth/act3/t23-order.html',''],
    T24:['truth/act3/t24-mayor.html',''],     T25:['truth/act3/t25-roster.html',''],      T26:['truth/act3/t26-money.html',''],
    T27:['truth/act3/t27-honor.html',''],
    T28:['truth/act4/t28-forum.html',''],     T29:['truth/act4/t29-wife.html',''],        T30:['truth/act4/t30-mother.html',''],
    T31:['truth/act4/t31-brother.html',''],   T32:['truth/act4/t32-notice.html',''],      T33:['truth/act4/t33-reply20y.html',''],
    T34:['truth/act4/t34-volunteer.html',''], T35:['truth/act4/t35-media.html',''],
    T36:['truth/act5/t36-scanroom.html',''],  T37:['truth/act5/t37-photo.html',''],       T38:['truth/act5/t38-tape.html',''],
    T39:['truth/act5/t39-signsheet.html',''], T40:['truth/act5/t40-vest.html',''],        T41:['truth/act5/t41-hydro.html',''],
    T42:['truth/act5/t42-relic.html',''],     T43:['truth/act5/t43-map.html',''],         T44:['truth/act5/t44-newspaper.html',''],
    T45:['truth/act6/t45-list.html',''],      T46:['truth/act6/t46-truth.html',''],       T47:['truth/act6/t47-diary.html',''],
    T48:['truth/act6/t48-later.html',''],     T49:['truth/act6/t49-heir.html',''],        T50:['truth/act6/t50-gate.html',''],
    T51:['truth/act6/t51-light.html',''],     T52:['truth/act6/t52-final.html',''],
    noise:null
  };
  var SITE_BY_DIR = { 'archive':'S_ARCHIVE', 'news':'S_NEWS', 'tieba':'S_TIEBA', 'wx':'S_WX' };

  /* 背景关键词 → 节点：点击后【直接打开对应网页】，像普通超链接一样。
     只收录"氛围 / 地情背景"词；真相词一律不在表内，点击仍回浏览器检索。
     与 browser.html 的 SEARCH_INDEX 中「背景容器 / 初期背景关键词」两段保持一致。 */
  var KW_BG = {
    /* 散落的旧网页 · 地情 */
    '1998年洪水':'B1998', '1998洪水':'B1998', '怀水河':'B1998', '拦河闸':'B1998',
    '永宁镇':'B1998', '县志':'B1998', '怀安水利志':'B1998', '怀安水利':'B1998',
    '怀安之声':'B_BBS',
    /* 新闻网 · 永宁堤 */
    '永宁堤':'B_DIKE',
    '怀安旧照数字化上线':'B_NEWS_DIG',
    '怀安日报 汛情通报':'B_NEWS_REP', '汛情通报':'B_NEWS_REP',
    /* 贴吧 · 渡口村 */
    '渡口村':'B_TIEBA_STORY', '怀安话老故事征集':'B_TIEBA_STORY',
    '怀安话·老故事征集':'B_TIEBA_STORY', '老故事征集':'B_TIEBA_STORY',
    /* 公众号 · 怀安发布 */
    '永宁堤加固工程纪实':'B_WX_DIKE', '怀安旧照征集令':'B_WX_PHOTO',
    '那年防汛记忆':'B_WX_MEM', '那年，我们一起守堤':'B_WX_MEM',
    /* 博客 · 江边旧事 */
    '我爹是摆渡的':'B_BLOG_FERRY', '江边那盏灯':'B_BLOG_LAMP'
  };

  /* 计算页面到项目根目录的相对前缀（本文件固定在 <root>/assets/nav.js） */
  var SELF_SRC = (function(){ try{ return document.currentScript ? document.currentScript.src : ''; }catch(e){ return ''; } })();
  var ROOT_PATH = (function(){
    try{ return SELF_SRC ? new URL(SELF_SRC).pathname.replace(/assets\/nav\.js$/,'') : ''; }catch(e){ return ''; }
  })();
  /* 当前页面相对项目根的路径，如 truth/act1/t01-oldfile.html */
  function relPath(){
    try{ if(ROOT_PATH && location.pathname.indexOf(ROOT_PATH) === 0) return location.pathname.slice(ROOT_PATH.length); }catch(e){}
    return location.pathname.split('/').pop();
  }
  var ROOT_PREFIX = (function(){
    var r = relPath(), depth = r.split('/').length - 1, out = '';
    for(var i=0;i<depth;i++) out += '../';
    return out;
  })();
  /* 回到 browser.html 的相对地址（任意层级自适应） */
  function browserUrl(q){
    return ROOT_PREFIX + 'browser.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
  }

  /* 上报一个节点到 localStorage（跨标签页共享，触发其它页 storage 事件） */
  function register(id){
    if(!id) return;
    try{
      var raw = localStorage.getItem('huaian1998_v3');
      var d = raw ? JSON.parse(raw) : {f:[], l:[]};
      if(!Array.isArray(d.f)) d.f = [];
      if(d.f.indexOf(id) === -1){ d.f.push(id); localStorage.setItem('huaian1998_v3', JSON.stringify(d)); }
    }catch(e){}
  }

  /* 全局可被页面内 onclick 调用：go('home') / go('关键词') / backHome() */
  window.go = function(q){
    if(q === 'home'){ window.open(browserUrl(''), '_blank', 'noopener'); return; }
    window.open(browserUrl(q), '_blank', 'noopener');
  };
  window.backHome = function(){ window.open(browserUrl(''), '_blank', 'noopener'); };
  window.picMiss = function(img){ if(img) img.style.display = 'none'; };
  /* 机密档案室：退出授权（供站点页调用） */
  var SECRET_KEY = 'huaian1998_secret_v2';
  var SECRET_PAGES = ['flood.html','his.html','radio.html','forum.html','scan.html'];
  window.lockSecret = function(){
    try{ localStorage.removeItem(SECRET_KEY); }catch(e){}
    location.reload();
  };

  function init(){
    /* 机密卷宗页未解锁：整页已被遮蔽，跳过进度上报与绑定 */
    if(document.querySelector('.secret-block')) return;
    /* 1) 精确节点：来自 browser.html 注入的 ?node= */
    var node = null;
    try{ node = new URLSearchParams(location.search).get('node'); }catch(e){}
    if(!node){
      /* 退化匹配：文件#锚点 唯一对应某节点时才上报，避免误报 */
      var here = relPath();
      var hash = location.hash.slice(1);
      var matches = [];
      for(var id in PAGE_ROUTE){
        var rt = PAGE_ROUTE[id]; if(!rt) continue;
        if(rt[0] === here && (rt[1] || '') === hash) matches.push(id);
      }
      if(matches.length === 1) node = matches[0];
    }
    register(node);

    /* 2) 站点首页级节点（各站点目录） */
    var parts = relPath().split('/'); parts.pop();
    var lastDir = parts[parts.length - 1];
    if(SITE_BY_DIR[lastDir]) register(SITE_BY_DIR[lastDir]);
    if(lastDir === 'blog') register('S_BLOG');

    /* 3) 正文关键词点击
     *    · 背景词（氛围 / 地情）→ 直接在新标签打开对应网页，像普通超链接
     *    · 真相词 → 回「怀安在线」检索（线索要自己一点点搜出来）
     */
    document.querySelectorAll('.kw').forEach(function(el){
      if(el.closest && el.closest('a')) return;   /* 已被链接包裹则不重复绑定 */
      var txt = (el.textContent || '').trim();
      var rt = KW_BG[txt] ? PAGE_ROUTE[KW_BG[txt]] : null;
      el.style.cursor = 'pointer';
      if(rt){
        var anchor = rt[1] ? ('#' + rt[1]) : '';
        if(rt[0] === relPath()){
          /* 指向本页的板块：就地滚动过去，不再开重复标签页 */
          el.title = anchor ? ('跳到本页 ' + anchor) : '回到本页顶部';
          el.addEventListener('click', function(){
            if(anchor) location.hash = rt[1]; else window.scrollTo({top:0, behavior:'smooth'});
          });
        }else{
          /* 背景词：直接在新标签打开对应网页，并定位到对应板块 */
          var url = ROOT_PREFIX + rt[0] + anchor;
          el.title = '打开网页：' + rt[0] + anchor;
          el.addEventListener('click', function(){ window.open(url, '_blank', 'noopener'); });
        }
      }else{
        el.title = '在怀安在线检索「' + txt + '」';
        el.addEventListener('click', function(){ window.open(browserUrl(txt), '_blank', 'noopener'); });
      }
    });

    /* 4) 跨页面链接 → 新标签页打开（原页保留） */
    document.querySelectorAll('a[href]').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if(h.indexOf('.html') !== -1 && h.charAt(0) !== '#'){
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      }
    });

    /* 5) 机密卷宗页：已解锁时浮出"锁上档案室" */
    var _fn = location.pathname.split('/').pop();
    if(SECRET_PAGES.indexOf(_fn) !== -1 && !document.querySelector('.secret-block')){
      var _lb = document.createElement('button');
      _lb.textContent = '🔒 锁上档案室';
      _lb.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:99;background:#C0392B;color:#fff;border:0;border-radius:8px;padding:9px 14px;font-size:13px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.3)';
      _lb.onclick = function(){ window.lockSecret(); };
      document.body.appendChild(_lb);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
