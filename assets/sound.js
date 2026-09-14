/* =========================================================================
 *  sound.js —— 全站唯一的声音来源（Web Audio 实时合成，不依赖任何音频文件）
 *
 *  设计约束：
 *   ① 浏览器禁止自动播放 —— 所有声音必须由玩家点击触发，页面上用
 *      .ev-play 按钮伪装成播放器 / 设备控件；
 *   ② 全部由振荡器与噪声合成，零素材、零体积；
 *   ③ 只服务三处：归钟、广播录音、黑屏视频的低频嗡鸣。
 *
 *  API：WS.bell / WS.tape / WS.drone / WS.ring44 / WS.stop
 * ========================================================================= */
(function () {
  "use strict";
  var ctx = null, nodes = [];

  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function track(n) { nodes.push(n); return n; }

  /* 一声钟：基频 + 三个非谐泛音，指数衰减 */
  function bell(freq, delay, dur, vol) {
    var c = ac(); if (!c) return;
    delay = delay || 0; dur = dur || 2.6; vol = vol == null ? 0.22 : vol;
    var t0 = c.currentTime + delay;
    var parts = [1, 2.76, 5.40, 8.93], amps = [1, 0.46, 0.24, 0.11];
    for (var i = 0; i < parts.length; i++) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq * parts[i], t0);
      /* 尾音略微下滑，像被什么东西压住 */
      o.frequency.exponentialRampToValueAtTime(freq * parts[i] * 0.988, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol * amps[i], t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * (1 - i * 0.16));
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.1);
      track(o);
    }
  }

  /* 磁带电流声：带通白噪 */
  function tape(dur, delay, vol) {
    var c = ac(); if (!c) return;
    dur = dur || 3; delay = delay || 0; vol = vol == null ? 0.05 : vol;
    var t0 = c.currentTime + delay;
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.7;
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.6;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.25);
    g.gain.setValueAtTime(vol, t0 + dur - 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t0); src.stop(t0 + dur + 0.05);
    track(src);
  }

  /* 低频嗡鸣：黑屏视频、地窖、终章用 */
  function drone(freq, dur, delay, vol) {
    var c = ac(); if (!c) return;
    freq = freq || 46; dur = dur || 12; delay = delay || 0; vol = vol == null ? 0.07 : vol;
    var t0 = c.currentTime + delay;
    var o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    o2.type = 'sine'; o2.frequency.value = freq * 1.006; /* 拍频，制造不安 */
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 2.2);
    g.gain.setValueAtTime(vol, t0 + dur - 2.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); o2.connect(g); g.connect(c.destination);
    o.start(t0); o2.start(t0); o.stop(t0 + dur + 0.1); o2.stop(t0 + dur + 0.1);
    track(o); track(o2);
  }

  function stop() {
    for (var i = 0; i < nodes.length; i++) { try { nodes[i].stop(0); } catch (e) {} }
    nodes = [];
  }

  /* 归钟：连敲 n 下。
   * onTick(i) 每敲一下回调（用于页面计数）；onEnd() 结束后回调。
   * 最后一下音高下压约 30 音分、余音更长 —— 对应正文「被什么东西压住了」。 */
  function ring44(n, onTick, onEnd, gap) {
    n = n || 44; gap = gap || 0.55;
    var base = 174.6, i = 0, timer = null;
    function step() {
      i++;
      var last = (i === n);
      bell(last ? base * 0.982 : base, 0, last ? 5.5 : 2.2, last ? 0.26 : 0.2);
      if (onTick) onTick(i, last);
      if (i >= n) {
        timer = setTimeout(function () { if (onEnd) onEnd(); }, 6000); /* 末尾 6 秒空拍 */
        return;
      }
      timer = setTimeout(step, gap * 1000);
    }
    step();
    return { cancel: function () { clearTimeout(timer); stop(); } };
  }

  window.WS = { bell: bell, tape: tape, drone: drone, ring44: ring44, stop: stop, ctx: ac };
  window.addEventListener('pagehide', stop);
})();
