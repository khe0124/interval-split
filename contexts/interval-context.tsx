import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { IntervalConfig, Round } from "@/types/interval";
import { saveData, loadData, STORAGE_KEYS } from "@/utils/storage";

interface IntervalContextType {
  config: IntervalConfig | null;
  isLoading: boolean;
  setConfig: (config: IntervalConfig) => Promise<void>;
  addRound: (round: Round) => Promise<void>;
  updateRound: (roundId: string, round: Round) => Promise<void>;
  deleteRound: (roundId: string) => Promise<void>;
  resetConfig: () => Promise<void>;
}

const IntervalContext = createContext<IntervalContextType | undefined>(undefined);

export function IntervalProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<IntervalConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 설정 불러오기
  useEffect(() => {
    loadSavedConfig();
  }, []);

  const loadSavedConfig = async () => {
    try {
      const savedConfig = await loadData<IntervalConfig>(STORAGE_KEYS.INTERVAL_CONFIG);
      if (savedConfig) {
        setConfigState(savedConfig);
      }
    } catch (error) {
      console.error("Error loading saved config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: IntervalConfig) => {
    try {
      await saveData(STORAGE_KEYS.INTERVAL_CONFIG, newConfig);
      setConfigState(newConfig);
    } catch (error) {
      console.error("Error saving config:", error);
      throw error;
    }
  };

  const setConfig = useCallback(async (newConfig: IntervalConfig) => {
    await saveConfig(newConfig);
  }, []);

  const addRound = useCallback(
    async (round: Round) => {
      const newConfig: IntervalConfig = !config
        ? { rounds: [round] }
        : { rounds: [...config.rounds, round] };
      await saveConfig(newConfig);
    },
    [config]
  );

  const updateRound = useCallback(
    async (roundId: string, updatedRound: Round) => {
      if (!config) return;
      const newConfig: IntervalConfig = {
        rounds: config.rounds.map((r) => (r.id === roundId ? updatedRound : r)),
      };
      await saveConfig(newConfig);
    },
    [config]
  );

  const deleteRound = useCallback(
    async (roundId: string) => {
      if (!config) return;
      const newConfig: IntervalConfig = {
        rounds: config.rounds.filter((r) => r.id !== roundId),
      };
      await saveConfig(newConfig);
    },
    [config]
  );

  const resetConfig = useCallback(async () => {
    try {
      await saveData(STORAGE_KEYS.INTERVAL_CONFIG, null);
      setConfigState(null);
    } catch (error) {
      console.error("Error resetting config:", error);
      throw error;
    }
  }, []);

  return (
    <IntervalContext.Provider
      value={{
        config,
        isLoading,
        setConfig,
        addRound,
        updateRound,
        deleteRound,
        resetConfig,
      }}
    >
      {children}
    </IntervalContext.Provider>
  );
}

export function useIntervalContext() {
  const context = useContext(IntervalContext);
  if (context === undefined) {
    throw new Error("useIntervalContext must be used within IntervalProvider");
  }
  return context;
}

