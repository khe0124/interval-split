import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { IntervalConfig, Block, Round, BlockTagColors, BlockTagLabels } from "@/types/interval";
import { WorkoutRecord, CompletedRound, CompletedBlock } from "@/types/workout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useWorkoutContext } from "@/contexts/workout-context";

interface TimerDisplayProps {
  config: IntervalConfig;
  onReset: () => void;
}

interface TimerState {
  roundIndex: number;
  roundRepeat: number;
  blockIndex: number;
  remainingTime: number;
  currentBlock: Block | null;
  currentRound: Round | null;
  isRunning: boolean;
  totalProgress: number;
}

export function TimerDisplay({ config, onReset }: TimerDisplayProps) {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addWorkoutRecord } = useWorkoutContext();
  const startTimeRef = useRef<number | null>(null);
  const completedRoundsRef = useRef<CompletedRound[]>([]);
  const currentRoundStartTimeRef = useRef<number | null>(null);
  const currentBlockStartTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<TimerState>(() => {
    const firstRound = config.rounds[0];
    const firstBlock = firstRound?.blocks[0];
    return {
      roundIndex: 0,
      roundRepeat: 1,
      blockIndex: 0,
      remainingTime: firstBlock?.duration || 0,
      currentBlock: firstBlock || null,
      currentRound: firstRound || null,
      isRunning: false,
      totalProgress: 0,
    };
  });

  const calculateTotalDuration = () => {
    let total = 0;
    config.rounds.forEach((round) => {
      round.blocks.forEach((block) => {
        total += block.duration * round.repeatCount;
      });
    });
    return total;
  };

  const calculateElapsedTime = () => {
    let elapsed = 0;
    for (let i = 0; i < state.roundIndex; i++) {
      const round = config.rounds[i];
      round.blocks.forEach((block) => {
        elapsed += block.duration * round.repeatCount;
      });
    }

    const currentRound = config.rounds[state.roundIndex];
    if (currentRound) {
      for (let i = 0; i < state.blockIndex; i++) {
        elapsed += currentRound.blocks[i]?.duration * (state.roundRepeat - 1);
      }
      elapsed +=
        (currentRound.blocks[state.blockIndex]?.duration || 0) -
        state.remainingTime;
    }

    return elapsed;
  };

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.remainingTime <= 1) {
            return handleBlockComplete(prev);
          }
          const elapsed = calculateElapsedTime() + 1;
          const total = calculateTotalDuration();
          return {
            ...prev,
            remainingTime: prev.remainingTime - 1,
            totalProgress: total > 0 ? elapsed / total : 0,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  const saveCompletedBlock = (block: Block, actualDuration: number) => {
    const completedBlock: CompletedBlock = {
      blockId: block.id,
      tag: block.tag,
      plannedDuration: block.duration,
      actualDuration,
      plannedSpeed: block.speed,
    };
    return completedBlock;
  };

  const handleBlockComplete = (prevState: TimerState): TimerState => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const currentRound = config.rounds[prevState.roundIndex];
    if (!currentRound || !prevState.currentBlock) return prevState;

    // 현재 블록 완료 기록
    const blockStartTime = currentBlockStartTimeRef.current || Date.now();
    const blockActualDuration = Math.floor((Date.now() - blockStartTime) / 1000);
    const completedBlock = saveCompletedBlock(prevState.currentBlock, blockActualDuration);

    // 현재 라운드 기록 찾기 또는 생성
    let currentCompletedRound = completedRoundsRef.current.find(
      (r) => r.roundId === currentRound.id
    );
    if (!currentCompletedRound) {
      currentCompletedRound = {
        roundId: currentRound.id,
        roundName: currentRound.name,
        completedRepeats: 0,
        blocks: [],
      };
      completedRoundsRef.current.push(currentCompletedRound);
    }

    // 블록 기록 추가
    currentCompletedRound.blocks.push(completedBlock);

    // 다음 블록으로
    if (prevState.blockIndex < currentRound.blocks.length - 1) {
      const nextBlock = currentRound.blocks[prevState.blockIndex + 1];
      currentBlockStartTimeRef.current = Date.now();
      return {
        ...prevState,
        blockIndex: prevState.blockIndex + 1,
        remainingTime: nextBlock.duration,
        currentBlock: nextBlock,
      };
    }

    // 다음 반복으로
    if (prevState.roundRepeat < currentRound.repeatCount) {
      const firstBlock = currentRound.blocks[0];
      currentCompletedRound.completedRepeats = prevState.roundRepeat;
      currentBlockStartTimeRef.current = Date.now();
      return {
        ...prevState,
        roundRepeat: prevState.roundRepeat + 1,
        blockIndex: 0,
        remainingTime: firstBlock.duration,
        currentBlock: firstBlock,
      };
    }

    // 라운드 완료 - 다음 라운드로
    if (prevState.roundIndex < config.rounds.length - 1) {
      const nextRound = config.rounds[prevState.roundIndex + 1];
      const nextBlock = nextRound.blocks[0];
      
      // 현재 라운드 완료 기록 업데이트
      currentCompletedRound.completedRepeats = currentRound.repeatCount;
      
      // 다음 라운드 기록 생성
      completedRoundsRef.current.push({
        roundId: nextRound.id,
        roundName: nextRound.name,
        completedRepeats: 0,
        blocks: [],
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      currentBlockStartTimeRef.current = Date.now();
      return {
        ...prevState,
        roundIndex: prevState.roundIndex + 1,
        roundRepeat: 1,
        blockIndex: 0,
        remainingTime: nextBlock.duration,
        currentBlock: nextBlock,
        currentRound: nextRound,
      };
    }

    // 모든 라운드 완료
    currentCompletedRound.completedRepeats = currentRound.repeatCount;

    // 운동 기록 저장
    const endTime = Date.now();
    const totalDuration = Math.floor((endTime - (startTimeRef.current || endTime)) / 1000);
    
    const workoutRecord: WorkoutRecord = {
      id: `workout-${Date.now()}`,
      startTime: startTimeRef.current || endTime,
      endTime,
      config: JSON.parse(JSON.stringify(config)), // 깊은 복사
      completedRounds: completedRoundsRef.current,
      totalDuration,
      status: "completed",
    };

    addWorkoutRecord(workoutRecord).catch((error) => {
      console.error("Error saving workout record:", error);
    });

    Alert.alert("완료!", "모든 인터벌을 완료했습니다!", [
      { text: "OK", onPress: onReset },
    ]);
    
    // 리셋
    startTimeRef.current = null;
    completedRoundsRef.current = [];
    currentBlockStartTimeRef.current = null;
    
    return {
      ...prevState,
      isRunning: false,
    };
  };

  const startTimer = () => {
    // 타이머 시작 시 시간 기록
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      currentBlockStartTimeRef.current = Date.now();
      completedRoundsRef.current = [];
      
      // 첫 라운드 기록 시작
      const firstRound = config.rounds[0];
      if (firstRound) {
        completedRoundsRef.current.push({
          roundId: firstRound.id,
          roundName: firstRound.name,
          completedRepeats: 0,
          blocks: [],
        });
      }
    }
    setState((prev) => ({ ...prev, isRunning: true }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pauseTimer = () => {
    setState((prev) => ({ ...prev, isRunning: false }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // 리셋 시 상태 초기화
  useEffect(() => {
    if (!state.isRunning && startTimeRef.current === null) {
      // 완전히 리셋된 상태
      completedRoundsRef.current = [];
      currentBlockStartTimeRef.current = null;
    }
  }, [state.isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const tagColors = state.currentBlock
    ? BlockTagColors[state.currentBlock.tag]
    : { light: "#ccc", dark: "#666" };
  const bgColor =
    colorScheme === "dark" ? tagColors.dark : tagColors.light;

  return (
    <ThemedView style={styles.container}>
      {/* 진행 바 */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${state.totalProgress * 100}%`, backgroundColor: tintColor },
          ]}
        />
      </View>

      {/* 현재 블록 태그 */}
      <View style={[styles.tagBadge, { backgroundColor: bgColor + "40" }]}>
        <ThemedText type="subtitle" style={styles.tagText}>
          {state.currentBlock
            ? BlockTagLabels[state.currentBlock.tag]
            : "준비"}
        </ThemedText>
      </View>

      {/* 타이머 */}
      <ThemedText style={styles.timeText}>
        {formatTime(state.remainingTime)}
      </ThemedText>

      {/* 현재 라운드 정보 */}
      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.roundInfo}>
          {state.currentRound?.name || ""}
          {!state.currentRound?.isFixed && ` (${state.roundRepeat}/${state.currentRound?.repeatCount || 1})`}
        </ThemedText>
        {state.currentBlock && (
          <ThemedText style={styles.speedInfo}>
            목표 속력: {state.currentBlock.speed} km/h
            {" "}
            ({formatPace(state.currentBlock.speed)})
          </ThemedText>
        )}
      </ThemedView>

      {/* 전체 진행 상황 */}
      <ThemedText style={styles.progressText}>
        라운드 {state.roundIndex + 1} / {config.rounds.length}
      </ThemedText>

      {/* 컨트롤 버튼 */}
      <ThemedView style={styles.controlsContainer}>
        {state.isRunning ? (
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.pauseButton,
              { backgroundColor: tintColor },
            ]}
            onPress={pauseTimer}
          >
            <IconSymbol name="pause.fill" size={32} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.playButton,
              { backgroundColor: tintColor },
            ]}
            onPress={startTimer}
          >
            <IconSymbol name="play.fill" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={() => {
            // 리셋 시 모든 상태 초기화
            startTimeRef.current = null;
            completedRoundsRef.current = [];
            currentBlockStartTimeRef.current = null;
            
            // 초기 상태로 리셋
            const firstRound = config.rounds[0];
            const firstBlock = firstRound?.blocks[0];
            setState({
              roundIndex: 0,
              roundRepeat: 1,
              blockIndex: 0,
              remainingTime: firstBlock?.duration || 0,
              currentBlock: firstBlock || null,
              currentRound: firstRound || null,
              isRunning: false,
              totalProgress: 0,
            });
            onReset();
          }}
        >
          <IconSymbol
            name="arrow.counterclockwise"
            size={24}
            color={tintColor}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

function formatPace(kmh: number): string {
  if (kmh === 0) return "-";
  const minutesPerKm = 60 / kmh;
  const mins = Math.floor(minutesPerKm);
  const secs = Math.floor((minutesPerKm - mins) * 60);
  return `${mins}'${secs.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    marginBottom: 30,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  tagBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  tagText: {
    fontSize: 18,
  },
  timeText: {
    fontSize: 72,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 2,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  roundInfo: {
    fontSize: 20,
    fontWeight: "600",
  },
  speedInfo: {
    fontSize: 16,
    opacity: 0.7,
  },
  progressText: {
    fontSize: 18,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 40,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: "auto",
    paddingBottom: 20,
  },
  controlButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  pauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  resetButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
  },
});

