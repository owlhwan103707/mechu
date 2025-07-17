/* ===== 슬롯머신 메뉴 데이터 =====
   icon + label 조합으로 표시
   원하면 자유롭게 수정 가능 */
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

/* HTML 요소 참조 */
const slotStrip = document.getElementById("slot");
const resultEl = document.getElementById("result");
const spinBtn = document.querySelector("button");

/* 내부 상태 */
let isSpinning = false;

/* 한 번에 돌릴 때 충분히 길게 보이도록 메뉴 반복 생성 개수 */
const REPEAT_COUNT = 40; // 원본 메뉴 40세트 = 8*40 = 320줄! (충분히 긴 스크롤)

/* ------- 초기 슬롯 내용 구성 ------- */
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

/* 요소 높이 정보 (빌드 후 계산) */
function getSlotMetrics() {
  const firstItem = slotStrip.children[0];
  const itemHeight = firstItem ? firstItem.offsetHeight : 60; // fallback
  const windowEl = slotStrip.parentElement; // .slot-window
  const windowHeight = windowEl.offsetHeight;
  return { itemHeight, windowHeight };
}

/* 결과 텍스트 표시 */
function showResult(text) {
  resultEl.classList.remove('fade-in');
  resultEl.textContent = `오늘의 메뉴는 ${text}!`;
  void resultEl.offsetWidth;
  resultEl.classList.add('fade-in');
}


/* 랜덤으로 메뉴 선택 후 해당 위치까지 스크롤 애니메이션 */
function spin() {
  if (isSpinning) return; // 연타 방지
  isSpinning = true;
  spinBtn.disabled = true;

  const { itemHeight, windowHeight } = getSlotMetrics();

  // 당첨 메뉴 선택
  const pickIndex = Math.floor(Math.random() * MENU_ITEMS.length);
  const pickItem = MENU_ITEMS[pickIndex];

  // 여러 바퀴 도는 효과를 위해 "기본 offset + 랜덤 루프 수" 계산
  // 루프마다 MENU_ITEMS.length 만큼 아이템 진행
  const minLoops = 8;             // 최소 몇 바퀴
  const extraLoops = Math.floor(Math.random() * 6); // 추가 바퀴 (0~5)
  const loops = minLoops + extraLoops;

  // 전체 리스트(반복된 목록) 중 목표 인덱스
  const targetIndex = loops * MENU_ITEMS.length + pickIndex;

  // 중앙 정렬 오프셋: 슬롯창 높이와 아이템 높이가 다를 경우 보정
  const offsetCenter = (windowHeight - itemHeight) / 2; // 현재 0일 가능성 큼

  // translateY는 위로 올릴수록 음수
  const targetY = -(targetIndex * itemHeight - offsetCenter);

  // 먼저 transition 제거 후 초기 위치(0)로 되돌려 애니메이션 준비
  slotStrip.style.transition = "none";
  slotStrip.style.transform = "translateY(0px)";

  // 브라우저에 초기 상태 반영 시간을 줌 (리플로우)
  requestAnimationFrame(() => {
    // 이제 transition 활성화하고 목표 위치로 이동
    const spinDuration = 2500 + Math.random() * 1000; // 2.5~3.5초
    slotStrip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    slotStrip.style.transform = `translateY(${targetY}px)`;
  });

  // transition 종료 후 결과 표시
  const onDone = () => {
    slotStrip.removeEventListener("transitionend", onDone);
    showResult(`🍽 ${pickItem.label}`);
    isSpinning = false;
    spinBtn.disabled = false;
  };
  slotStrip.addEventListener("transitionend", onDone);
}
