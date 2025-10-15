export interface Task {
  taskId: number;
  title: string;
  dayNum: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  lastCompletedDate: string;
  hasBeenEdited: boolean;
  canEdit: boolean;
  editDeadline: string;
  missionTitle: string;
  subGoalTitle: string;
  partyCompletion: {
    completedMembers: number;
    totalMembers: number;
  };
  today: boolean;
}

export interface UpdateTaskCompletionBody {
  taskId: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  date: string;
}

export interface TaskCompletion {
  taskId: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  completedDate: string;
  dailyProgressRate: number; // 하루 진행률 (0~100)
  weeklyProgressRate: number; // 주간 진행률 (0~100)
  missionProgressRate: number; // 전체 미션 진행률 (0~100)
  newTitles: string[];
}
