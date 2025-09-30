export const VALID_VARIANTS = ['care', 'habit', 'study', 'exercise', 'etc'] as const;

  // Variant 키(study|exercise|habit|care|etc)를 우선 허용하고,
  // 한글/문구가 들어올 경우 기존 매핑으로 처리
export const mapTag = (t?: string) => {
  if (!t) return 'etc' as const;
  const s = t.replace(/\s+/g, '').toLowerCase();
  if ((VALID_VARIANTS as readonly string[]).includes(s)) {
    return s as (typeof VALID_VARIANTS)[number];
  }
  if (s.includes('운동')) return 'exercise' as const;
  if (s.includes('학습')) return 'study' as const;
  if (s.includes('생활')) return 'habit' as const;
  if (s.includes('멘탈') || s.includes('케어')) return 'care' as const;
  return 'etc' as const;
};

export const variantToKorean = (t?: string) => {
  if (!t) return '기타';
  const s = t.replace(/\s+/g, '').toLowerCase();
  const map: Record<string, string> = {
    care: '멘탈 케어',
    habit: '생활 습관',
    study: '학습',
    exercise: '운동',
    etc: '기타'
  };
  if ((VALID_VARIANTS as readonly string[]).includes(s)) return map[s];
  return t;
};
