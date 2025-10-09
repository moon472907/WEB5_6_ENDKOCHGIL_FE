export interface CreateNotificationBody {
  memberId: number;
  message: string;
  type: string;
}

export interface Notification {
  id: number;
  memberID: number;
  type: string;
  message: string;
  isRead: boolean;
  createDate: string;
  modifyDate: string;
}
