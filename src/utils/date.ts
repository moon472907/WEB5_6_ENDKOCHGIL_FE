/**
 * 연/월/일 객체를 YYYY-MM-DD 문자열로 변환
 */
export const formatBirthDate = (year: string, month: string, day: string): string => {
  if (!year || !month || !day) return '';

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};