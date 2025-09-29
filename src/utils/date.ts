/**
 * 연/월/일 객체를 YYYY-MM-DD 문자열로 변환
 */
export const formatBirthDate = (year: string, month: string, day: string): string => {
  if (!year || !month || !day) return '';

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * 전달받은 날짜를 "M월 DD일 요일" 형태로 변환
 */
export const formatToday = (date?: Date): string => {
  const targetDate = date ?? new Date();

  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const dayOfWeek = targetDate.getDay();

  const weekNames = ['일', '월', '화', '수', '목', '금', '토'];

  return `${month}월 ${day}일 ${weekNames[dayOfWeek]}요일`;
};