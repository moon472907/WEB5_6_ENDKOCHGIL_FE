export interface Item {
  id: number;
  name: string;
  img: string;
  price: number;
  category: 'nature' | 'festival' | 'sports' | 'character' | 'special';
  owned: boolean;
}

export const mockItems: Item[] = [
  // 자연(nature)
  { id: 1, name: '스노쿨링 룩', img: '/images/nuts-kid.png', price: 500, category: 'nature', owned: false },
  { id: 2, name: '등산복', img: '/images/nuts-kid.png', price: 600, category: 'nature', owned: true },
  { id: 3, name: '캠핑 모자', img: '/images/nuts-kid.png', price: 700, category: 'nature', owned: false },
  { id: 4, name: '꽃 반지', img: '/images/nuts-kid.png', price: 400, category: 'nature', owned: true },
  { id: 5, name: '숲속 망토', img: '/images/nuts-kid.png', price: 900, category: 'nature', owned: false },

  // 축제(festival)
  { id: 6, name: '할로윈 룩', img: '/images/nuts-kid.png', price: 800, category: 'festival', owned: true },
  { id: 7, name: '크리스마스 모자', img: '/images/nuts-kid.png', price: 500, category: 'festival', owned: false },
  { id: 8, name: '신년 파티복', img: '/images/nuts-kid.png', price: 1200, category: 'festival', owned: false },
  { id: 9, name: '불꽃놀이 셔츠', img: '/images/nuts-kid.png', price: 600, category: 'festival', owned: true },
  { id: 10, name: '축제 마스크', img: '/images/nuts-kid.png', price: 700, category: 'festival', owned: false },

  // 스포츠(sports)
  { id: 11, name: '축구 유니폼', img: '/images/nuts-kid.png', price: 700, category: 'sports', owned: false },
  { id: 12, name: '농구 유니폼', img: '/images/nuts-kid.png', price: 800, category: 'sports', owned: true },
  { id: 13, name: '야구 모자', img: '/images/nuts-kid.png', price: 400, category: 'sports', owned: false },
  { id: 14, name: '테니스 셔츠', img: '/images/nuts-kid.png', price: 900, category: 'sports', owned: true },
  { id: 15, name: '수영복', img: '/images/nuts-kid.png', price: 1000, category: 'sports', owned: false },

  // 캐릭터(character)
  { id: 16, name: '강아지 옷', img: '/images/nuts-kid.png', price: 1000, category: 'character', owned: true },
  { id: 17, name: '고양이 옷', img: '/images/nuts-kid.png', price: 900, category: 'character', owned: false },
  { id: 18, name: '곰돌이 옷', img: '/images/nuts-kid.png', price: 1100, category: 'character', owned: true },
  { id: 19, name: '토끼 옷', img: '/images/nuts-kid.png', price: 950, category: 'character', owned: false },
  { id: 20, name: '판다 옷', img: '/images/nuts-kid.png', price: 1200, category: 'character', owned: true },

  // 특별(special)
  { id: 21, name: '왕관', img: '/images/nuts-kid.png', price: 2000, category: 'special', owned: false },
  { id: 22, name: '마법 지팡이', img: '/images/nuts-kid.png', price: 2500, category: 'special', owned: true },
  { id: 23, name: '용의 날개', img: '/images/nuts-kid.png', price: 3000, category: 'special', owned: false },
  { id: 24, name: '별빛 망토', img: '/images/nuts-kid.png', price: 2800, category: 'special', owned: true },
  { id: 25, name: '황금 갑옷', img: '/images/nuts-kid.png', price: 3500, category: 'special', owned: false }
];
