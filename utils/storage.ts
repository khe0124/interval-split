import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 저장소 키 상수
 */
export const STORAGE_KEYS = {
  INTERVAL_CONFIG: "@interval-split:config",
  WORKOUT_RECORDS: "@interval-split:workout-records",
  SETTINGS: "@interval-split:settings",
} as const;

/**
 * JSON 데이터 저장
 */
export async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error);
    throw error;
  }
}

/**
 * JSON 데이터 불러오기
 */
export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data from ${key}:`, error);
    return null;
  }
}

/**
 * 데이터 삭제
 */
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from ${key}:`, error);
    throw error;
  }
}

/**
 * 모든 데이터 삭제
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
}

