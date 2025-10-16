'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import NotificationItem from './NotificationItem';
import { useNotificationStore } from './useNotificationStore';
import useOutsideClick from '@/hooks/useOutsideClick';

interface NotificationListProps {
  accessToken?: string;
}

export default function NotificationList({
  accessToken
}: NotificationListProps) {
  const {
    notifications,
    hasUnread,
    fetchNotifications,
    markAsRead,
    removeNotification
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications(accessToken);
  }, [accessToken, fetchNotifications]);

  // 외부 클릭 감지해서 닫기
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="relative cursor-pointer"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="알림 보기"
      >
        <Image src="/images/bell.svg" alt="알림" width={30} height={30} />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[45px] right-0 w-[280px] bg-basic-white shadow-lg rounded-lg border border-gray-200 p-3 pb-0 z-50">
          <h3 className="font-semibold mb-2 text-sm text-gray-700">
            알림 목록
          </h3>
          {notifications.length > 0 ? (
            <ul className="scrollbar-v2 flex flex-col gap-2 max-h-[240px] overflow-y-auto pb-7 overflow-x-visible overflow-visible">
              {notifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={() => markAsRead(n.id)}
                  onDelete={() => removeNotification(n.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4 pb-8">
              알림이 없습니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
