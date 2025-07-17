const MENU_ITEMS = [
  { icon: "🍜", label: "라면" },
  { icon: "🍙", label: "김밥" },
  { icon: "🍗", label: "치킨" },
  { icon: "🥗", label: "샐러드" },
  { icon: "🍛", label: "카레" },
  { icon: "🍲", label: "마라탕" },
  { icon: "🍝", label: "파스타" },
  { icon: "🍱", label: "도시락" }
];

const slotStrip = document.getElementById("slot");
const resultEl = document.getElementById("result");
const spinBtn = document.querySelector("button");
let isSpinning = false;
const REPEAT_COUNT = 40;

function buildStrip() {
  const frag = document.createDocumentFragment();
  for (let r = 0; r < REPEAT_COUNT; r++) {
    MENU_ITEMS.forEach(item => {
      const div = document.createElement("div");
      div.textContent = `${item.icon} ${item.label}`;
      frag.appendChild(div);
    });
  }
  slotStrip.appendChild(frag);
}
buildStrip();

function getSlotMetrics() {
  const firstItem = slotStrip.children[0];
  const itemHeight = firstItem ? firstItem.offsetHeight : 60;
  const windowEl = slotStrip.parentElement;
  const windowHeight = windowEl.offsetHeight;
  return { itemHeight, windowHeight };
}

function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function showResult(text) {
  resultEl.textContent = `오늘의 메뉴는 🍽 ${text}!`;

  resultEl.classList.remove("celebrate"); // 중복 방지
  void resultEl.offsetWidth; // 강제 리플로우로 애니메이션 재적용
  resultEl.classList.add("celebrate");

  resultEl.style.opacity = 0;
  requestAnimationFrame(() => {
    resultEl.style.opacity = 1;
  });

  fireConfetti(); // 🎉 폭죽 실행
}


function spin() {
  if (isSpinning) return;
  isSpinning = true;
  spinBtn.disabled = true;

  const { itemHeight, windowHeight } = getSlotMetrics();
  const pickIndex = Math.floor(Math.random() * MENU_ITEMS.length);
  const pickItem = MENU_ITEMS[pickIndex];
  const minLoops = 8;
  const extraLoops = Math.floor(Math.random() * 6);
  const loops = minLoops + extraLoops;
  const targetIndex = loops * MENU_ITEMS.length + pickIndex;
  const offsetCenter = (windowHeight - itemHeight) / 2;
  const targetY = -(targetIndex * itemHeight - offsetCenter);

  slotStrip.style.transition = "none";
  slotStrip.style.transform = "translateY(0px)";

  requestAnimationFrame(() => {
    const spinDuration = 2500 + Math.random() * 1000;
    slotStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    slotStrip.style.transform = `translateY(${targetY}px)`;
  });

  const onDone = () => {
    slotStrip.removeEventListener("transitionend", onDone);
    showResult(pickItem.label);       // ⭐️ 결과 보여주기
    fireConfetti();                   // 💥 폭죽 효과 여기로 옮기기
    isSpinning = false;
    spinBtn.disabled = false;
  };
  slotStrip.addEventListener("transitionend", onDone);
}
