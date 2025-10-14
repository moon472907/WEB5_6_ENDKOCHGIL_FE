export interface UserProfile {
  id: number;
  name: string;
  code: string;
  birth: string; // ISO 날짜 문자열
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  level: number;
  xp: number;
  xpReq: number;
  money: number;
  title: string;
  item: string;
}