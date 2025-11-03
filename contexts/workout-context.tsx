import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  WorkoutRecord,
  WorkoutStats,
  DailyWorkoutRecord,
} from "@/types/workout";
import { saveData, loadData, STORAGE_KEYS } from "@/utils/storage";

interface WorkoutContextType {
  records: WorkoutRecord[];
  isLoading: boolean;
  addWorkoutRecord: (record: WorkoutRecord) => Promise<void>;
  updateWorkoutRecord: (recordId: string, record: Partial<WorkoutRecord>) => Promise<void>;
  deleteWorkoutRecord: (recordId: string) => Promise<void>;
  getWorkoutStats: () => WorkoutStats;
  getDailyRecords: (date: string) => DailyWorkoutRecord;
  getAllDailyRecords: () => DailyWorkoutRecord[];
  clearAllRecords: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<WorkoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 기록 불러오기
  useEffect(() => {
    loadSavedRecords();
  }, []);

  const loadSavedRecords = async () => {
    try {
      const savedRecords = await loadData<WorkoutRecord[]>(STORAGE_KEYS.WORKOUT_RECORDS);
      if (savedRecords) {
        setRecords(savedRecords);
      }
    } catch (error) {
      console.error("Error loading saved workout records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecords = async (newRecords: WorkoutRecord[]) => {
    try {
      await saveData(STORAGE_KEYS.WORKOUT_RECORDS, newRecords);
      setRecords(newRecords);
    } catch (error) {
      console.error("Error saving workout records:", error);
      throw error;
    }
  };

  const addWorkoutRecord = useCallback(
    async (record: WorkoutRecord) => {
      const newRecords = [record, ...records];
      await saveRecords(newRecords);
    },
    [records]
  );

  const updateWorkoutRecord = useCallback(
    async (recordId: string, updates: Partial<WorkoutRecord>) => {
      const newRecords = records.map((record) =>
        record.id === recordId ? { ...record, ...updates } : record
      );
      await saveRecords(newRecords);
    },
    [records]
  );

  const deleteWorkoutRecord = useCallback(
    async (recordId: string) => {
      const newRecords = records.filter((record) => record.id !== recordId);
      await saveRecords(newRecords);
    },
    [records]
  );

  const getWorkoutStats = useCallback((): WorkoutStats => {
    const completedRecords = records.filter((r) => r.status === "completed");
    
    if (completedRecords.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        totalDistance: 0,
        completedRounds: 0,
        averageDuration: 0,
        longestWorkout: 0,
        shortestWorkout: 0,
      };
    }

    const totalDuration = completedRecords.reduce(
      (sum, record) => sum + record.totalDuration,
      0
    );
    const durations = completedRecords.map((r) => r.totalDuration);
    const completedRounds = completedRecords.reduce(
      (sum, record) => sum + record.completedRounds.length,
      0
    );

    // 거리는 속력과 시간으로 계산 (예상)
    const totalDistance = completedRecords.reduce((sum, record) => {
      const distance = record.completedRounds.reduce((roundSum, round) => {
        return roundSum + round.blocks.reduce((blockSum, block) => {
          const hours = block.actualDuration / 3600;
          return blockSum + block.plannedSpeed * hours;
        }, 0);
      }, 0);
      return sum + distance;
    }, 0);

    return {
      totalWorkouts: completedRecords.length,
      totalDuration,
      totalDistance,
      completedRounds,
      averageDuration: totalDuration / completedRecords.length,
      longestWorkout: Math.max(...durations),
      shortestWorkout: Math.min(...durations),
    };
  }, [records]);

  const getDailyRecords = useCallback(
    (date: string): DailyWorkoutRecord => {
      const dateRecords = records.filter((record) => {
        const recordDate = new Date(record.startTime).toISOString().split("T")[0];
        return recordDate === date;
      });

      const totalDuration = dateRecords
        .filter((r) => r.status === "completed")
        .reduce((sum, record) => sum + record.totalDuration, 0);
      const totalRounds = dateRecords.reduce(
        (sum, record) => sum + record.completedRounds.length,
        0
      );

      return {
        date,
        records: dateRecords,
        totalDuration,
        totalRounds,
      };
    },
    [records]
  );

  const getAllDailyRecords = useCallback((): DailyWorkoutRecord[] => {
    const dateMap = new Map<string, WorkoutRecord[]>();

    records.forEach((record) => {
      const date = new Date(record.startTime).toISOString().split("T")[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, []);
      }
      dateMap.get(date)!.push(record);
    });

    return Array.from(dateMap.entries())
      .map(([date, dateRecords]) => {
        const completedRecords = dateRecords.filter((r) => r.status === "completed");
        const totalDuration = completedRecords.reduce(
          (sum, record) => sum + record.totalDuration,
          0
        );
        const totalRounds = dateRecords.reduce(
          (sum, record) => sum + record.completedRounds.length,
          0
        );

        return {
          date,
          records: dateRecords,
          totalDuration,
          totalRounds,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // 최신순 정렬
  }, [records]);

  const clearAllRecords = useCallback(async () => {
    try {
      await saveData(STORAGE_KEYS.WORKOUT_RECORDS, []);
      setRecords([]);
    } catch (error) {
      console.error("Error clearing workout records:", error);
      throw error;
    }
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        records,
        isLoading,
        addWorkoutRecord,
        updateWorkoutRecord,
        deleteWorkoutRecord,
        getWorkoutStats,
        getDailyRecords,
        getAllDailyRecords,
        clearAllRecords,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkoutContext() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkoutContext must be used within WorkoutProvider");
  }
  return context;
}

