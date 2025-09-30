'use client';

import Image from 'next/image';
import Tooltip from '@/components/ui/Tooltip';

interface FormSectionProps {
  icon: string;
  alt: string;
  label: string;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
  sibling?: boolean
}

export default function FormSection({
  icon,
  alt,
  label,
  tooltip,
  children,
  sibling
}: FormSectionProps) {
  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-0.5 w-full">
        <Image
          src={icon}
          alt={alt}
          width={20}
          height={20}
          className="w-[20px] h-[20px] object-contain"
        />
        <p>{label}</p>
        {tooltip && (
          <Tooltip message={tooltip} position="top">
            <Image
              src="/images/info.png"
              alt={`${label} 도움말`}
              width={20}
              height={20}
              className="w-[20px] h-[20px] object-contain cursor-pointer"
            />
          </Tooltip>
        )}
      {sibling && <div className="ml-auto">{children}</div>}
      </div>
      <div>{sibling ? '' : children}</div>
    </section>
  );
}
