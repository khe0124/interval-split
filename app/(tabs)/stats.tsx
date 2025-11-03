import { StyleSheet, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            통계
          </ThemedText>
        </View>

        {/* 전체 통계 카드 */}
        <ThemedView style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol name="chart.bar.fill" size={24} color={tintColor} />
            <ThemedText type="subtitle" style={styles.cardTitle}>
              전체 통계
            </ThemedText>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>총 운동 횟수</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>0분</ThemedText>
              <ThemedText style={styles.statLabel}>총 운동 시간</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>0km</ThemedText>
              <ThemedText style={styles.statLabel}>총 거리</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>완료한 라운드</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* 주간 통계 */}
        <ThemedView style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol name="calendar.badge.clock" size={24} color={tintColor} />
            <ThemedText type="subtitle" style={styles.cardTitle}>
              주간 통계
            </ThemedText>
          </View>
          <View style={styles.weeklyStats}>
            <ThemedText style={styles.emptyText}>
              아직 운동 기록이 없습니다.
            </ThemedText>
          </View>
        </ThemedView>

        {/* 최근 운동 */}
        <ThemedView style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol name="clock.fill" size={24} color={tintColor} />
            <ThemedText type="subtitle" style={styles.cardTitle}>
              최근 운동
            </ThemedText>
          </View>
          <View style={styles.recentWorkouts}>
            <ThemedText style={styles.emptyText}>
              최근 운동 기록이 없습니다.
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  weeklyStats: {
    paddingVertical: 20,
  },
  recentWorkouts: {
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: "center",
  },
});

