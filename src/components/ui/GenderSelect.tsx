'use client';

import Button from '@/components/ui/Button';

interface GenderSelectProps {
  value: '남성' | '여성' | null;
  onChange: (val: '남성' | '여성') => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        variant={value === '남성' ? 'basic' : 'unselected'}
        size="lg"
        fullWidth
        onClick={() => onChange('남성')}
      >
        남성
      </Button>
      <Button
        variant={value === '여성' ? 'basic' : 'unselected'}
        size="lg"
        fullWidth
        onClick={() => onChange('여성')}
      >
        여성
      </Button>
    </div>
  );
}
