(() => {
  const startBackdrop = document.getElementById('start-backdrop');
  const confirmBtn = document.getElementById('confirm-btn');
  const popupLayer = document.getElementById('popup-layer');
  const bgMusic = document.getElementById('bgMusic');
  const snowCanvas = document.getElementById('snowCanvas');
  const replayBtn = document.getElementById('replay-btn');

  const messages = [
    { title: '立冬安康', desc: '冬意渐浓，愿你心里常有光。' },
    { title: '贴心提醒', desc: '多添一件衣，少吹一阵风。' },
    { title: '温暖到达', desc: '愿热汤与热爱，刚好抵达你。' },
    { title: '今日愿望', desc: '所念皆所愿，所行皆坦途。' },
    { title: '节气问候', desc: '昼短夜长，愿你睡得更香。' },
    { title: '心向暖阳', desc: '向着光走，温柔都会接住你。' },
    { title: '冬日序曲', desc: '风有方向，爱有归途。' },
    { title: '柔软时刻', desc: '被子厚一点，心也软一点。' },
    { title: '小确幸', desc: '奶茶温度刚好，朋友恰好想你。' },
    { title: '好好爱自己', desc: '给自己多一点耐心与拥抱。' },
    { title: '心安即归处', desc: '愿你每一步都不被寒冷打扰。' },
    { title: '轻轻喜欢', desc: '看雪落下，把烦恼藏好。' },
    { title: '烟火气', desc: '一碗热面，一句问候，刚刚好。' },
    { title: '暖心叮嘱', desc: '出门记得围巾，回家记得笑。' },
    { title: '冬日清光', desc: '霜降未尽，心愿未晚。' },
    { title: '如约而至', desc: '冬天会到，你的好运也会到。' },
    { title: '微光点点', desc: '灯火可亲，万事皆宜。' },
    { title: '生活小诗', desc: '热茶、热饭、热爱，和你。' },
    { title: '节气祝福', desc: '立冬吉，万事宁。' },
    { title: '拥抱自己', desc: '你值得被温柔以待。' },
    { title: '明天会更好', desc: '雪会停，风会住，心会晴。' },
    { title: '心底柔软', desc: '愿世界对你稍微偏爱一点。' },
    { title: '冬日问候', desc: '愿你把冷风拒之门外。' },
    { title: '万事顺遂', desc: '所爱隔山海，山海亦可平。' },
    { title: '温暖相拥', desc: '愿你被频频想起，也被好好珍惜。' },
    { title: '少些苛责', desc: '偶尔躲进厚被里，世界会更柔软。' },
    { title: '把心照亮', desc: '云会散，雪会融，春会来。' },
    { title: '愿一切刚好', desc: '不急不躁，且听风雪低语。' },
    { title: '及时行暖', desc: '给他人一点温暖，给自己很多温柔。' },
    { title: '此刻欢喜', desc: '看见你，就像看见冬日的第一束光。' },
    { title: '愿望清单', desc: '健康、平安、常喜乐。' },
    { title: '心里有光', desc: '雪夜有灯，路上有你。' },
    { title: '人间值得', desc: '愿四季都对你温柔以待。' },
    { title: '冬有暖阳', desc: '见你一面，抵过所有风霜。' },
    { title: '祝你所盼', desc: '所求皆如愿，所行皆坦荡。' },
    { title: '快乐加倍', desc: '被子里藏好快乐，出门里带走希望。' },
    { title: '给你点光', desc: '愿你不被风雪阻挡。' },
    { title: '如常热爱', desc: '生活是热的，心也是。' },
  ];

  const activePopups = [];
  let sequenceTimer = null;
  let snowInitialized = false;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function showPopup({ x, y, autoClose = false, message } = {}) {
    const m = message || messages[Math.floor(Math.random() * messages.length)];
    const el = document.createElement('div');
    el.className = 'popup';
    const rx = x != null ? x : randomBetween(20, 80) + 'vw';
    const ry = y != null ? y : randomBetween(20, 80) + 'vh';
    el.style.setProperty('--x', typeof rx === 'number' ? rx + 'px' : rx);
    el.style.setProperty('--y', typeof ry === 'number' ? ry + 'px' : ry);
    el.innerHTML = `
      <button class="close" aria-label="关闭">×</button>
      <div class="title">${m.title}</div>
      <div class="desc">${m.desc}</div>
    `;
    popupLayer.appendChild(el);
    const closer = el.querySelector('.close');
    closer.addEventListener('click', () => {
      const idx = activePopups.indexOf(el);
      if (idx >= 0) activePopups.splice(idx, 1);
      el.remove();
    });
    if (autoClose) setTimeout(() => el.remove(), 6000);
    activePopups.push(el);
    return el;
  }

  function heartPointAt(t, s, cx, cy) {
    const x = s * 16 * Math.pow(Math.sin(t), 3);
    const y = -s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: cx + x, y: cy + y };
  }

  function sampleHeartArc(n, s, cx, cy) {
    // 弧长均匀采样：先高密度采样，再按累计长度平均选点
    const oversample = Math.max(400, n * 12);
    const pts = new Array(oversample + 1);
    const ts = new Array(oversample + 1);
    for (let i = 0; i <= oversample; i++) {
      const t = (i / oversample) * Math.PI * 2; // 0..2π
      ts[i] = t;
      pts[i] = heartPointAt(t, s, cx, cy);
    }
    const cum = new Array(oversample + 1);
    cum[0] = 0;
    for (let i = 1; i <= oversample; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      cum[i] = cum[i - 1] + Math.hypot(dx, dy);
    }
    const total = cum[oversample];
    const step = total / n;
    const out = [];
    let j = 1;
    for (let k = 0; k < n; k++) {
      const target = step * k;
      while (j <= oversample && cum[j] < target) j++;
      const j0 = Math.max(0, j - 1);
      const segLen = cum[j] - cum[j0] || 1;
      const r = Math.min(1, Math.max(0, (target - cum[j0]) / segLen));
      out.push({
        x: pts[j0].x + r * (pts[j].x - pts[j0].x),
        y: pts[j0].y + r * (pts[j].y - pts[j0].y),
      });
    }
    return out;
  }

  function formHeart() {
    // 已按轨迹生成，无需再次排列；此函数保留以备需要时稳定对齐
    const W = window.innerWidth;
    const H = window.innerHeight;
    const sBase = Math.min(W, H) / 18;
    const s = sBase * 0.6;
    const cx = W / 2;
    const cy = H / 2 + s * 0.2;
    const pts = sampleHeartArc(activePopups.length, s, cx, cy);
    popupLayer.classList.add('heart-phase');
    activePopups.forEach((el, i) => {
      el.classList.add('heart');
      el.style.setProperty('--x', pts[i].x.toFixed(1) + 'px');
      el.style.setProperty('--y', pts[i].y.toFixed(1) + 'px');
    });
  }

  function initSnow() {
    if (!snowCanvas) return;
    if (snowInitialized) return;
    const ctx = snowCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      const w = snowCanvas.clientWidth;
      const h = snowCanvas.clientHeight;
      snowCanvas.width = Math.floor(w * dpr);
      snowCanvas.height = Math.floor(h * dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const flakesCount = Math.floor(Math.min(snowCanvas.width, snowCanvas.height) / 10);
    const flakes = new Array(flakesCount).fill(0).map(() => ({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      r: (Math.random() * 1.5 + 0.5) * dpr,
      vy: (Math.random() * 0.6 + 0.3) * dpr,
      vx: (Math.random() * 0.3 - 0.15) * dpr,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let last = performance.now();
    function step(now) {
      const dt = Math.min(50, now - last) / 16.7; // ~60fps 基准归一化
      last = now;
      ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
      for (const f of flakes) {
        f.y += f.vy * dt;
        f.x += f.vx * dt + Math.sin((f.y + now / 40) / 50) * 0.2 * dpr;
        if (f.y > snowCanvas.height + 5 * dpr) {
          f.y = -5 * dpr;
          f.x = Math.random() * snowCanvas.width;
        }
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    snowInitialized = true;
  }

  function generatePoints() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const sBase = Math.min(W, H) / 18;
    const s = sBase * 0.6;
    const cx = W / 2;
    const cy = H / 2 + s * 0.2;
    const boundaryCount = 240; // 边界点更密集以填满心形轮廓
    const boundary = sampleHeartArc(boundaryCount, s, cx, cy);
    // 中心填充：更多内心形曲线，提升整体密度
    const rings = [0.90, 0.82, 0.74, 0.66, 0.58, 0.50, 0.42, 0.34, 0.26, 0.18, 0.10];
    const perRing = 32;
    const fill = [];
    for (const r of rings) {
      const inner = sampleHeartArc(perRing, s * r, cx, cy);
      fill.push(...inner);
    }
    return boundary.concat(fill);
  }

  function startSequence() {
    startBackdrop.classList.add('hidden');
    bgMusic.volume = 0.5;
    try { bgMusic.play().catch(() => {}); } catch {}

    initSnow();

    const pts = generatePoints();
    let i = 0;
    const palette = [
      ['#5e2a3b','#3d1b29','#b55b7c'], // 暖粉
      ['#513018','#3a2210','#d0904b'], // 暖橘
      ['#4d2d3f','#361f2d','#a36aa0'], // 玫瑰棕
      ['#4c3320','#392618','#b07a44'], // 肉桂
      ['#3e2a48','#2a1d35','#8e67b7'], // 葡萄紫
      ['#5a2c1f','#3f1f16','#c06c4c'], // 焦糖
    ];
    const effects = ['effect-zoom','effect-slide','effect-float','effect-bounce','effect-sway'];
    sequenceTimer = setInterval(() => {
      const p = pts[i];
      const el = showPopup({ x: p.x, y: p.y, autoClose: false });
      if (el && el.style) el.style.willChange = 'transform';
      const [c1,c2,cBorder] = palette[i % palette.length];
      el.style.setProperty('--c1', c1);
      el.style.setProperty('--c2', c2);
      el.style.setProperty('--cBorder', cBorder);
      el.classList.add(effects[i % effects.length]);
      i += 1;
      if (i >= pts.length) {
        clearInterval(sequenceTimer);
        sequenceTimer = null;
      }
    }, 38);
  }

  function resetSequence() {
    if (sequenceTimer) { clearInterval(sequenceTimer); sequenceTimer = null; }
    popupLayer.classList.remove('heart-phase');
    while (activePopups.length) {
      const el = activePopups.pop();
      if (el && el.remove) el.remove();
    }
    startSequence();
  }

  confirmBtn.addEventListener('click', startSequence);
  if (replayBtn) replayBtn.addEventListener('click', resetSequence);
})();