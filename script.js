const menu = ['라면', '김밥', '떡볶이', '치킨', '돈까스', '샐러드', '파스타', '마라탕'];
const canvas = document.getElementById('roulette');
const ctx = canvas.getContext('2d');
const arc = (2 * Math.PI) / menu.length;
let angle = 0;

function drawRoulette() {
  for (let i = 0; i < menu.length; i++) {
    const start = i * arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 140, start, end);
    ctx.fillStyle = i % 2 === 0 ? '#ffcc80' : '#ffe0b2';
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.translate(150, 150);
    ctx.rotate(start + arc / 2);
    ctx.fillText(menu[i], 70, 0);
    ctx.rotate(-(start + arc / 2));
    ctx.translate(-150, -150);
  }
}

drawRoulette();

function spinRoulette() {
  const duration = 3000;
  const spins = Math.floor(Math.random() * 5) + 5;
  const targetAngle = angle + 2 * Math.PI * spins + Math.random() * 2 * Math.PI;

  const startTime = performance.now();
  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    angle = angle + (targetAngle - angle) * progress;
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
      document.getElementById('result').textContent = `오늘의 메뉴는 🍽 ${menu[index]}!`;
    }
  }
  requestAnimationFrame(animate);
}
