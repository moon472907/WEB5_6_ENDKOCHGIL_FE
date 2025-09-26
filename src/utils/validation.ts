export const isValidYear = (y: string, currentYear = new Date().getFullYear()) =>
  Number(y) >= 1900 && Number(y) <= currentYear;

export const isValidMonth = (m: string) =>
  Number(m) >= 1 && Number(m) <= 12;

export const isValidDay = (y: string, m: string, d: string): boolean => {
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  if (!year || !month || !day) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
};