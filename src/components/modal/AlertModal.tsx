'use client';

import BaseModal from './BaseModal';
import Button from '../ui/Button';

interface Props {
  open: boolean;
  onConfirm: () => void;
  confirmText?: string;
  title: string;
  description?: string;
  detail?: string;
}

function AlertModal({
  open,
  onConfirm,
  confirmText = '적용',
  title,
  description,
  detail
}: Props) {
  return (
    <BaseModal isOpen={open} onClose={onConfirm}>
      {/* 텍스트 영역 */}
      <div className="text-center space-y-3">
        {/* 타이틀 */}
        <h2 className="text-xl font-semibold text-basic-black">{title}</h2>

        {/* 설명 */}
        <p className="text-sm font-normal text-gray-04">{description}</p>

        {/* 세부 사항 */}
        <p className="text-base font-medium text-gray-08">{detail}</p>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-3">
        <Button
          type="button"
          onClick={onConfirm}
          variant="basic"
          size="md"
          fullWidth
        >
          {confirmText}
        </Button>
      </div>
    </BaseModal>
  );
}

export default AlertModal;
