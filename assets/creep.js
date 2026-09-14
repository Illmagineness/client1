/* =========================================================================
 *  creep.js —— 全站共用的「页面自己也知道你在看它」层
 *
 *  三件事，都不改变任何可玩内容，只加恐惧：
 *   ① 重访计数：同一页面第二次以后打开，页脚上方会多一行字，
 *      次数越多，那行字越不像网站该说的话；
 *   ② 三更彩蛋：本地时间 03:00–03:59（或地址栏带 ?night=1）打开任意页，
 *      整页压暗偏冷，并多出一行「这个点，还有人在看这一页。」；
 *   ③ 停留注视：在同一页停留超过 90 秒，页脚那行字再变一次。
 * ========================================================================= */
(function () {
  "use strict";
  var VK = 'wushi_visits';

  function key() {
    var p = location.pathname.split('/').slice(-2).join('/');
    return p || location.pathname;
  }
  function bump() {
    var n = 1;
    try {
      var raw = localStorage.getItem(VK), d = raw ? JSON.parse(raw) : {};
      if (!d || typeof d !== 'object') d = {};
      var k = key();
      n = (d[k] || 0) + 1;
      d[k] = n;
      localStorage.setItem(VK, JSON.stringify(d));
    } catch (e) {}
    return n;
  }
  function isNight() {
    try {
      if (/[?&]night=1/.test(location.search)) return true;
      return new Date().getHours() === 3;
    } catch (e) { return false; }
  }

  function line1(n) {
    if (n <= 1) return '';
    if (n === 2) return '本页最近一次被打开：刚刚。';
    if (n === 3) return '你已经是第 3 次打开这一页。';
    if (n === 4) return '第 4 次。它不会多告诉你一个字。';
    if (n <= 7) return '第 ' + n + ' 次。你还在找什么？';
    if (n <= 12) return '第 ' + n + ' 次。它一直就是这个样子。';
    return '第 ' + n + ' 次。你比我记得的还清楚。';
  }

  function inject(text, id) {
    var old = document.getElementById(id);
    if (old) old.parentNode.removeChild(old);
    if (!text) return null;
    var d = document.createElement('div');
    d.id = id;
    d.textContent = text;
    d.style.cssText = 'position:fixed;left:0;right:0;bottom:38px;z-index:8;text-align:center;' +
      'font-family:Consolas,monospace;font-size:11.5px;letter-spacing:.06em;' +
      'color:#8a8f98;opacity:.72;pointer-events:none;padding:0 16px;';
    document.body.appendChild(d);
    return d;
  }

  function init() {
    var n = bump();
    var t = line1(n);
    if (t) inject(t, 'creep-line');

    if (isNight()) {
      document.body.classList.add('fx-night');
      inject(line1(n) ? line1(n) : '——这个点，还有人在看这一页。', 'creep-line');
      var d = document.getElementById('creep-line');
      if (d) {
        d.style.color = '#c98a6b';
        d.textContent = '三更。这一页还有人在看。';
      }
    }

    /* 停留注视 */
    setTimeout(function () {
      var el = document.getElementById('creep-line');
      if (!el) { el = inject('你已经在这一页上待了很久。', 'creep-line'); }
      else if (el.textContent.indexOf('待了很久') < 0) {
        el.textContent = '你已经在这一页上待了很久。';
      }
    }, 90000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
