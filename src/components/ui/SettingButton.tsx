'use client';

import React from "react";
import { MdLockOutline } from "react-icons/md";

interface SettingButtonProps {
  children: React.ReactNode;
  locked?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export default function SettingButton({
  children,
  locked = false,
  fullWidth = true,
  onClick,
}: SettingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-start rounded-xl text-basic-black px-4 py-2 text-base font-semibold transition-colors cursor-pointer
        ${fullWidth ? "w-full" : "w-auto"}
        ${
          locked
            ? "bg-bg-disabled hover:bg-[#c4c4c4]"
            : "bg-button-unselected hover:bg-bg-card-active"
        }`}
    >
      <span className="flex-1 text-left">{children}</span>
      {locked && <MdLockOutline className="ml-2 text-gray-04" size={20} />}
    </button>
  );
}
