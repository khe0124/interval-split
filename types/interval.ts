/**
 * 블록 태그 타입
 */
export type BlockTag = "warmup" | "fast" | "slow" | "cooldown";

/**
 * 블록 인터페이스
 */
export interface Block {
  id: string;
  tag: BlockTag;
  duration: number; // 초 단위
  speed: number; // km/h
}

/**
 * 라운드 인터페이스
 */
export interface Round {
  id: string;
  name: string;
  repeatCount: number; // 반복 횟수
  blocks: Block[];
  isFixed?: boolean; // 고정 라운드 (워밍업, 쿨다운)
}

/**
 * 인터벌 설정
 */
export interface IntervalConfig {
  rounds: Round[];
}

/**
 * 태그별 컬러 설정
 */
export const BlockTagColors: Record<BlockTag, { light: string; dark: string }> = {
  warmup: { light: "#FFE5B4", dark: "#8B6914" }, // 베이지
  fast: { light: "#FFB3BA", dark: "#8B0000" }, // 빨강
  slow: { light: "#BAE1FF", dark: "#003366" }, // 파랑
  cooldown: { light: "#BAFFC9", dark: "#006400" }, // 초록
};

/**
 * 태그 라벨
 */
export const BlockTagLabels: Record<BlockTag, string> = {
  warmup: "워밍업",
  fast: "빠른 구간",
  slow: "느린 구간",
  cooldown: "쿨다운",
};

