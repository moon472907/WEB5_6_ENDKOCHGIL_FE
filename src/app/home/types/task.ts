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
  dailyProgressRate: number;
  weeklyProgressRate: number;
  missionProgressRate: number;
  newTitles: string[];
}
