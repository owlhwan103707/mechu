const MENU_ITEMS = [
  { icon: "😍", label: "라면에 계란" },
  { icon: "😍", label: "김밥천국" },
  { icon: "😍", label: "교촌치킨" },
  { icon: "😍", label: "풀떼기" },
  { icon: "😍", label: "3분카레" },
  { icon: "😍", label: "마라탕" },
  { icon: "😍", label: "파스타" },
  { icon: "😍", label: "삼겹살" },
  { icon: "😍", label: "김치찜" },
  { icon: "😍", label: "묵사발" },
  { icon: "😍", label: "비냉+고기" },
  { icon: "😍", label: "든든한 국밥!" },
  { icon: "😍", label: "그리운 집밥 ㅠㅠ" }
];

const slotStrip = document.getElementById("slot");
const resultEl = document.getElementById("result");
const spinBtn = document.querySelector("button");
let isSpinning = false
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
  console.log("🔥 fireConfetti 호출됨");
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else {
    console.warn("⚠️ confetti 함수가 정의되지 않았습니다.");
  }
}


function showResult(text) {
  resultEl.textContent = `그럼 우리 오늘 ${text}! 먹자`;


  resultEl.classList.remove("celebrate"); 
  void resultEl.offsetWidth; 
  resultEl.classList.add("celebrate");

  resultEl.style.opacity = 0;
  requestAnimationFrame(() => {
    resultEl.style.opacity = 1;
  });

  fireConfetti();
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
    showResult(pickItem.label);       
    fireConfetti();
    isSpinning = false;
    spinBtn.disabled = false;
  };
  slotStrip.addEventListener("transitionend", onDone);
}


spinBtn.addEventListener("dblclick", () => {
  console.log("💥 직접 폭죽 테스트");
  fireConfetti();
});

