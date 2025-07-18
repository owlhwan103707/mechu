const MENU_ITEMS = [
  { icon: "😍", label: "라면에 파송송 계란탁!" },
  { icon: "😍", label: "물에 밥 비벼" },
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
  { icon: "😍", label: "그리운 집밥 ㅠㅠ" },
  { icon: "😍", label: "명륜진사갈비(무실점)" },
  { icon: "😍", label: "휫자" },
  { icon: "😍", label: "뿌링뿌링뿌리링" },
  { icon: "😍", label: "삼계tang!" },
  { icon: "😍", label: "베라??!?!?" },
  { icon: "😍", label: "빙siuuuuuu" },
  { icon: "😍", label: "중식" },
  { icon: "😍", label: "봉구스 밥버거" },
  { icon: "😍", label: "비빔밥" },
  { icon: "😍", label: "근본제육" },
  { icon: "😍", label: "평양냉면" },
  { icon: "😍", label: "오마카세" },
  { icon: "😍", label: "초밥" },
  { icon: "😍", label: "국수나무🌲" },
  { icon: "😍", label: "깨스깨스동깨스" },
  { icon: "😍", label: "성찬식당" },
  { icon: "😍", label: "라멘" },
  { icon: "😍", label: "햄버거" },
  { icon: "😍", label: "소고기!!" },
  { icon: "😍", label: "맥주에 감자튀김" },
  { icon: "😍", label: "쭈꾸미 볶음" },
  { icon: "😍", label: "콩나물 불고기" },
  { icon: "😍", label: "몸도 으슬으슬하니 죽" },
  { icon: "😍", label: "명랑핫도그!" },
  { icon: "😍", label: "타코야끼" },
  { icon: "😍", label: "닭볶음탕" },
  { icon: "😍", label: "족발" },
  { icon: "😍", label: "보쌈" },
  { icon: "😍", label: "오꼬노미야끼" },
  { icon: "😍", label: "규카츠" },
  { icon: "😍", label: "미역국" },
  { icon: "😍", label: "비빔밥" },
  { icon: "😍", label: "육개장" },
  { icon: "😍", label: "구수한 된장찌개" },
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
      div.textContent = `${item.icon} ${item.label}`;  // ✅ 백틱으로 감싸기
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
  resultEl.innerHTML = `그럼 우리 오늘<br>${text}! 먹자`;  // ✅ 줄바꿈으로 두 줄 구성

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
  slotStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;  // ✅
  slotStrip.style.transform = `translateY(${targetY}px)`;  // ✅
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

//무슨 폭죽 오류인진 몰라도 더블클릭시 폭죽 나오게 설정
spinBtn.addEventListener("dblclick", () => {
  console.log("💥 직접 폭죽 테스트");
  fireConfetti();
});
