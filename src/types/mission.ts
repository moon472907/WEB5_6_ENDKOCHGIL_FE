import { ApiResponse } from "@/@types/global";

// Mission 생성 Request
export interface CreateMissionRequest {
  title: string;
  type: 'AI';
  periodWeeks: number;
  maxMembers: number;
  isPublic: boolean;
}

// 개별 Task
export interface MissionTask {
  taskId: number;
  title: string;
  dayNum: number;
  status: string;
  lastCompletedDate: string | null;
  hasBeenEdited: boolean;
  canEdit: boolean;
  editDeadline: string;
  today: boolean;
}

// Mission SubGoal
export interface MissionSubGoal {
  subGoalId: number;
  title: string;
  weekNum: number;
  startDate: string;
  endDate: string;
  weekProgressRate: number;
  partyWeekProgress: number | null;
  visible: boolean;
  tasks: MissionTask[];
}

// Mission 본문
export interface MissionContent {
  missionId: number;
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  currentWeek: number;
  partyId: number | null;
  myProgressRate: number;
  partyProgress: number | null;
  subGoals: MissionSubGoal[];
  completed: boolean;
  partyMission: boolean;
}

// Mission Response
export type MissionResponse = ApiResponse<MissionContent>;