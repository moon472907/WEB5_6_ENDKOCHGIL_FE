import { ApiResponse } from "@/@types/global";

export interface Task {
  taskId: number;
  title: string;
  dayNum: number;
  status: "PENDING" | "COMPLETED" | string;
  lastCompletedDate: string;
  hasBeenEdited: boolean;
  canEdit: boolean;
  editDeadline: string;
  today: boolean;
}

export type GetTodayTaskResponse = ApiResponse<Task[]>;