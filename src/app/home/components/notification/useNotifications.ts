'use client';

import { useState, useEffect } from 'react';
import {
  getAllNotifications,
  readNotification,
  deleteNotification
} from '@/lib/api/notification';
import { Notification } from '@/types/notification';

// 알림 데이터 fetch, 읽음 처리, 삭제 로직 관리
export function useNotifications(accessToken?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await getAllNotifications(accessToken);
        const list = res.content ?? [];
        setNotifications(list);
        setHasUnread(list.some((n: Notification) => !n.isRead));
      } catch (err) {
        console.error('알림 조회 실패:', err);
      }
    }
    fetchNotifications();
  }, [accessToken]);

  const handleRead = async (id: number) => {
    try {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      await readNotification(id);
    } catch (err) {
      console.error('읽음 처리 실패:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      await deleteNotification(id);
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return { notifications, hasUnread, handleRead, handleDelete };
}
