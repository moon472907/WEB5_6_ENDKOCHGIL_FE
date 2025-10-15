'use client';

import { create } from 'zustand';
import { Notification } from '@/types/notification';
import { getAllNotifications, readNotification, deleteNotification } from '@/lib/api/notification';

interface NotificationState {
  notifications: Notification[];
  hasUnread: boolean;
  fetchNotifications: (accessToken?: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => Promise<void>;
  removeNotification: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  hasUnread: false,

  fetchNotifications: async (accessToken?: string) => {
    try {
      const res = await getAllNotifications(accessToken);
      const list = res.content ?? [];
      set({
        notifications: list,
        hasUnread: list.some((n: Notification) => !n.isRead),
      });
    } catch (err) {
      console.error('알림 조회 실패:', err);
    }
  },

  addNotification: (notification: Notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      hasUnread: true,
    })),

  markAsRead: async (id: number) => {
    try {
      await readNotification(id);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        return {
          notifications: updated,
          hasUnread: updated.some((n) => !n.isRead),
        };
      });
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  },

  removeNotification: async (id: number) => {
    try {
      await deleteNotification(id);
      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== id);
        return {
          notifications: updated,
          hasUnread: updated.some((n) => !n.isRead),
        };
      });
    } catch (err) {
      console.error('알림 삭제 실패:', err);
    }
  },
}));
