import { IntervalConfig, Block, BlockTag } from "./interval";

/**
 * 운동 기록 인터페이스
 */
export interface WorkoutRecord {
  id: string;
  startTime: number; // Unix timestamp (밀리초)
  endTime: number | null; // Unix timestamp (밀리초), null이면 중단된 운동
  config: IntervalConfig; // 사용된 설정 (스냅샷)
  completedRounds: CompletedRound[]; // 완료된 라운드 정보
  totalDuration: number; // 총 운동 시간 (초)
  status: "completed" | "paused" | "cancelled"; // 운동 상태
}

/**
 * 완료된 라운드 정보
 */
export interface CompletedRound {
  roundId: string;
  roundName: string;
  completedRepeats: number; // 완료한 반복 횟수
  blocks: CompletedBlock[]; // 완료된 블록들
}

/**
 * 완료된 블록 정보
 */
export interface CompletedBlock {
  blockId: string;
  tag: BlockTag;
  plannedDuration: number; // 계획된 시간 (초)
  actualDuration: number; // 실제 소요 시간 (초)
  plannedSpeed: number; // 계획된 속력 (km/h)
}

/**
 * 운동 통계
 */
export interface WorkoutStats {
  totalWorkouts: number; // 총 운동 횟수
  totalDuration: number; // 총 운동 시간 (초)
  totalDistance: number; // 총 거리 (km) - 예상
  completedRounds: number; // 완료한 총 라운드 수
  averageDuration: number; // 평균 운동 시간 (초)
  longestWorkout: number; // 가장 긴 운동 시간 (초)
  shortestWorkout: number; // 가장 짧은 운동 시간 (초)
}

/**
 * 날짜별 운동 기록
 */
export interface DailyWorkoutRecord {
  date: string; // YYYY-MM-DD 형식
  records: WorkoutRecord[];
  totalDuration: number; // 하루 총 운동 시간 (초)
  totalRounds: number; // 하루 완료한 총 라운드 수
}

