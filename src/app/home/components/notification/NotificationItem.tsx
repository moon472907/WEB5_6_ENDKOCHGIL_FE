'use client';

import { useState, useEffect, useRef } from 'react';
import { Notification } from '@/types/notification';
import { MdMoreVert } from 'react-icons/md';
import NotificationMenu from './NotificationMenu';

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
  onDelete: () => void;
}

// 개별 알림 항목
export default function NotificationItem({
  notification,
  onRead,
  onDelete
}: NotificationItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!notification) return null;

  return (
    <li
      ref={itemRef}
      className={`relative flex justify-between items-start gap-2 text-sm p-2 rounded-md ${
        notification.isRead
          ? 'bg-basic-white text-gray-09'
          : 'bg-stone-200 text-gray-09'
      }`}
    >
      <div className="flex-1 pr-5">
        <p>{notification.message}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          {new Date(notification.createDate).toLocaleString('ko-KR')}
        </p>
      </div>

      <button
        className="absolute top-2 right-2 text-gray-04 has-hover:text-gray-08 active:text-gray-08 cursor-pointer"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <MdMoreVert size={18} />
      </button>

      {menuOpen && (
        <NotificationMenu
          onRead={() => {
            onRead();
            setMenuOpen(false);
          }}
          onDelete={() => {
            onDelete();
            setMenuOpen(false);
          }}
        />
      )}
    </li>
  );
}
