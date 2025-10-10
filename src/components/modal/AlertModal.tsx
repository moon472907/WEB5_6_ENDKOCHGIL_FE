'use client';

import BaseModal from './BaseModal';
import Button from '../ui/Button';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  title: string;
  description?: string;
  detail?: string;
  disabled?: boolean;
  disabledMessage?: string; 
}

function AlertModal({
  open,
  onConfirm,
  onCancel,
  confirmText = '적용',
  title,
  description,
  detail,
  disabled = false,
  disabledMessage
}: Props) {
  return (
    <BaseModal isOpen={open} onClose={onCancel}>
      {/* 텍스트 영역 */}
      <div className="text-center space-y-3 break-keep">
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
          onClick={disabled ? onCancel : onConfirm}
          variant="basic"
          size="md"
          fullWidth
        >
          {disabled ? '닫기' : confirmText}
        </Button>

        {/* 비활성화 안내 문구 */}
        {disabled && disabledMessage && (
          <p className="mt-2 text-sm text-red-600 text-center">
            {disabledMessage}
          </p>
        )}

      </div>
    </BaseModal>
  );
}

export default AlertModal;
