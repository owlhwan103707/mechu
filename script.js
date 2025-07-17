const menu = ['라면', '김밥', '떡볶이', '치킨', '돈까스', '샐러드', '파스타', '마라탕'];
const canvas = document.getElementById('roulette');
const ctx = canvas.getContext('2d');
const arc = (2 * Math.PI) / menu.length;
let angle = 0;

// 룰렛 그리기
function drawRoulette() {
  for (let i = 0; i < menu.length; i++) {
    const start = i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 140, start, end);
    ctx.fillStyle = i % 2 === 0 ? '#ffe082' : '#ffcc80';
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Pretendard, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(menu[i], 120, 5);
    ctx.restore();
  }
}

// 룰렛 애니메이션
function spinRoulette() {
  const spins = Math.floor(Math.random() * 4) + 6;
  const targetAngle = angle + 2 * Math.PI * spins + Math.random() * 2 * Math.PI;
  const duration = 3000;
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    angle = angle + (targetAngle - angle) * easedProgress;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(angle);
    ctx.translate(-150, -150);
    drawRoulette();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const index = Math.floor((menu.length - (angle % (2 * Math.PI)) / arc) % menu.length);
      const resultText = `오늘의 메뉴는 🍽 ${menu[index]}!`;
      const resultEl = document.getElementById('result');
      resultEl.textContent = resultText;
      resultEl.classList.remove('fade-in');
      void resultEl.offsetWidth; // reflow 트릭
      resultEl.classList.add('fade-in');
    }
  }

  requestAnimationFrame(animate);
}

// 초기 렌더링
drawRoulette();
