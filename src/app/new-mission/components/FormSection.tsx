'use client';

import Image from 'next/image';
import Tooltip from '@/components/ui/Tooltip';
import { MdInfoOutline } from 'react-icons/md';

interface FormSectionProps {
  icon: string | React.ReactNode;
  alt: string;
  label: string;
  tooltip?: React.ReactNode;
  children?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export default function FormSection({
  icon,
  alt,
  label,
  tooltip,
  children,
  rightElement
}: FormSectionProps) {
  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          {typeof icon === 'string' ? (
            <Image
              src={icon}
              alt={alt}
              width={20}
              height={20}
              className="w-[20px] h-[20px] object-contain"
            />
          ) : (
            icon
          )}
          <p className='text-button-point'>{label}</p>
          {tooltip && (
            <Tooltip message={tooltip} position="top">
              <MdInfoOutline size={20} className='text-orange-main' />
            </Tooltip>
          )}
        </div>
        {rightElement}
      </div>
      <div>{children}</div>
    </section>
  );
}
