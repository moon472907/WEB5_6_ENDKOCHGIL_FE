'use client';

import Checkbox from './Checkbox';

// TODO: 여기서 경험치, 코인, 칭호, 미션 api 연결 함수 onChange에 내려주기
export default function CheckboxWrapper() {
  return (
    <>
      <Checkbox
        label="러닝 1시간 하기"
        onChange={checked => console.log('체크 상태:', checked)}
      />
    </>
  );
}
