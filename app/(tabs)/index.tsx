import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { IntervalSetup } from "@/components/interval/interval-setup";
import { TimerDisplay } from "@/components/interval/timer-display";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useIntervalContext } from "@/contexts/interval-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ScreenMode = "empty" | "setup" | "timer";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const { config } = useIntervalContext();
  const [mode, setMode] = useState<ScreenMode>(config ? "timer" : "empty");

  // 설정이 변경되면 모드 업데이트
  useEffect(() => {
    if (config && mode === "setup") {
      setMode("timer");
    } else if (!config && mode === "timer") {
      setMode("empty");
    }
  }, [config, mode]);

  const handleStartSetup = () => {
    setMode("setup");
  };

  const handleReset = () => {
    setMode("empty");
  };

  // 설정 모드
  if (mode === "setup") {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMode(config ? "timer" : "empty")}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={tintColor} />
            <ThemedText style={{ color: tintColor }}>뒤로</ThemedText>
          </TouchableOpacity>
        </View>
        <IntervalSetup />
      </ThemedView>
    );
  }

  // 타이머 모드
  if (mode === "timer" && config) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMode("setup")}
            style={styles.settingsButton}
          >
            <IconSymbol name="gear" size={24} color={tintColor} />
          </TouchableOpacity>
        </View>
        <TimerDisplay config={config} onReset={handleReset} />
      </ThemedView>
    );
  }

  // 빈 상태 (설정 없음)
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol
            name="timer"
            size={80}
            color={tintColor}
            style={{ opacity: 0.5 }}
          />
        </View>
        <ThemedText type="title" style={styles.emptyTitle}>
          인터벌 타이머
        </ThemedText>
        <ThemedText style={styles.emptyDescription}>
          운동 인터벌을 설정하고{"\n"}효과적인 러닝 트레이닝을 시작하세요
        </ThemedText>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: tintColor }]}
          onPress={handleStartSetup}
        >
          <ThemedText style={styles.startButtonText}>
            설정하고 시작하기
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  settingsButton: {
    marginLeft: "auto",
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 100,
  },
  iconContainer: {
    marginBottom: 30,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
