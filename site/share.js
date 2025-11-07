(() => {
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch {
      // 作为回退，创建临时输入框
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); alert('已复制到剪贴板'); } catch {}
      ta.remove();
    }
  };

  const { origin, pathname } = window.location;
  // 兼容 GitHub Pages 仓库子路径：推断站点根为当前 share.html 所在目录的上级
  // e.g. https://user.github.io/repo/site/share.html -> 根为 https://user.github.io/repo/
  const base = origin + pathname.replace(/\/site\/share\.html.*$/, '/');
  const giftUrl = base + 'index.html';
  const pageUrl = base + 'site/share.html';

  const btnGift = document.getElementById('copy-gift');
  const btnPage = document.getElementById('copy-page');
  const btnCard = document.getElementById('download-card');
  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');

  function drawCard() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#2b1f35');
    grad.addColorStop(1, '#0f1325');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = '#ffc19a';
    ctx.font = 'bold 42px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText('立冬暖心礼物', 40, 80);

    // Subtitle
    ctx.fillStyle = '#eaeaf5';
    ctx.font = '24px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText('雪花与心形弹框的暖心互动礼物', 40, 120);

    // URL
    ctx.fillStyle = '#ff9a6e';
    ctx.font = '22px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText('打开链接：' + giftUrl, 40, H - 80);

    // Simple heart path
    ctx.strokeStyle = '#ff9a6e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const cx = W * 0.75, cy = H * 0.52, s = 80;
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      const x = cx + s * 16 * Math.pow(Math.sin(t), 3);
      const y = cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function downloadCard() {
    drawCard();
    const a = document.createElement('a');
    a.download = '立冬暖心礼物-分享图.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  drawCard();
  if (btnGift) btnGift.addEventListener('click', () => copyText(giftUrl));
  if (btnPage) btnPage.addEventListener('click', () => copyText(pageUrl));
  if (btnCard) btnCard.addEventListener('click', downloadCard);
})();