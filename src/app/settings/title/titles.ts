export interface Title {
  id: number;
  name: string;       // 이름 + 이모지
  condition: string;  // 획득 조건
  description: string; // 설명
  locked: boolean;    // 잠금 여부
}

export const mockTitles: Title[] = [
  {
    id: 1,
    name: "나혼자 레벨업 ⚔️",
    condition: "목표 10개 이상 혼자 달성",
    description: "“누구의 도움도 필요 없어! 혼자서도 충분히 강해지는 중.”",
    locked: false
  },
  {
    id: 2,
    name: "열정 다람쥐 🔥",
    condition: "7일 연속 목표 달성",
    description: "“도토리보다 뜨거운 건 당신의 열정!”",
    locked: false
  },
  {
    id: 3,
    name: "새싹 다람쥐 🌱",
    condition: "첫 번째 목표 생성",
    description: "“작은 새싹이 숲을 바꾸듯, 당신의 첫 걸음이 시작됐어요.”",
    locked: false
  },
  {
    id: 4,
    name: "람쥐 썬더 ⚡",
    condition: "하루에 목표 3개 달성",
    description: "“번개처럼 빠른 실행력, 그게 바로 당신의 무기예요.”",
    locked: false
  },
  {
    id: 5,
    name: "흥청망청 💸",
    condition: "코인 지출 1000개 이상 기록",
    description: "“오늘은 펑펑! 하지만 내일은 절약 다람쥐가 되어야 해요.”",
    locked: true
  },
  {
    id: 6,
    name: "칭호 수집왕 🏅",
    condition: "칭호 10개 이상 획득",
    description: "“칭호를 모으다 보니, 어느새 내가 왕이 되어버렸군.”",
    locked: true
  },
  {
    id: 7,
    name: "패션 다람쥐 👗",
    condition: "쇼핑 5회 이상",
    description: "“숲 속에서도 스타일은 포기 못 해! 오늘도 런웨이 다람쥐.”",
    locked: true
  },
  {
    id: 8,
    name: "티끌모아 태산 🏔️",
    condition: "코인 1000개 이상 최초 달성",
    description: "“작은 도토리가 모여 큰 산을 이룬다.”",
    locked: true
  },
  {
    id: 9,
    name: "스트레칭 도전자 🤸",
    condition: "‘운동’ 카테고리 미션 3회 이상",
    description: "“유연한 몸에는 유연한 마음이 깃든다.”",
    locked: true
  },
  {
    id: 10,
    name: "인싸 다람쥐 🎉",
    condition: "5인 파티 참여 1회 이상",
    description: "“숲 속 파티의 중심은 언제나 나!”",
    locked: true
  }
];