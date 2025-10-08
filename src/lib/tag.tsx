// 사용 가능한 카테고리 variant (프로젝트 내부에서 공통으로 쓰는 값)
export const VALID_VARIANTS = ['care', 'habit', 'study', 'exercise', 'etc'] as const;

// 서버 ENUM → 로컬 variant 매핑
// 서버에서 오는 값: LEARNING, EXERCISE, HABIT, MENTAL, CUSTOM
export const categoryMap: Record<string, (typeof VALID_VARIANTS)[number]> = {
  LEARNING: 'study',
  EXERCISE: 'exercise',
  HABIT: 'habit',
  MENTAL: 'care',
  CUSTOM: 'etc'
};

// 로컬 variant → 서버 ENUM 매핑 (API 호출 시 사용)
export const toServerEnum: Record<(typeof VALID_VARIANTS)[number], string> = {
  study: 'LEARNING',
  exercise: 'EXERCISE',
  habit: 'HABIT',
  care: 'MENTAL',
  etc: 'CUSTOM'
};

// 로컬 variant → 한글 표기 매핑
export const variantToKoreanMap: Record<(typeof VALID_VARIANTS)[number], string> = {
  care: '멘탈 케어',
  habit: '생활 습관',
  study: '학습',
  exercise: '운동',
  etc: '기타'
};

// 통합 매퍼: 서버 ENUM, 로컬 variant, 한글 문자열 모두 처리
export const mapTag = (t?: string) => {
  if (!t) return 'etc' as const;

  const s = t.replace(/\s+/g, '').toUpperCase();

  // 서버 ENUM 매핑 (LEARNING → study 등)
  if (s in categoryMap) {
    return categoryMap[s as keyof typeof categoryMap];
  }

  // 로컬 variant 그대로 들어온 경우 (study/exercise 등)
  const lower = s.toLowerCase();
  if ((VALID_VARIANTS as readonly string[]).includes(lower)) {
    return lower as (typeof VALID_VARIANTS)[number];
  }

  // 한글 키워드 대응
  if (s.includes('운동')) return 'exercise' as const;
  if (s.includes('학습')) return 'study' as const;
  if (s.includes('생활')) return 'habit' as const;
  if (s.includes('멘탈') || s.includes('케어')) return 'care' as const;

  return 'etc' as const;
};

// variant를 한글로 변환
export const variantToKorean = (t?: string) => {
  if (!t) return '기타';

  // 먼저 mapTag로 안전하게 변환한 후, 한글 매핑 적용
  const variant = mapTag(t);
  return variantToKoreanMap[variant];
};
