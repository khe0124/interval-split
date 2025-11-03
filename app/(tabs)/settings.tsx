import { StyleSheet, ScrollView, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useIntervalContext } from "@/contexts/interval-context";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const { config, resetConfig } = useIntervalContext();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleResetData = () => {
    resetConfig();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            설정
          </ThemedText>
        </View>

        {/* 알림 설정 */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            알림
          </ThemedText>
          <ThemedView style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="bell.fill" size={20} color={tintColor} />
              <ThemedText style={styles.settingLabel}>알림 허용</ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: tintColor + "80" }}
              thumbColor={notificationsEnabled ? tintColor : "#f4f3f4"}
            />
          </ThemedView>
        </ThemedView>

        {/* 앱 설정 */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            앱 설정
          </ThemedText>
          <ThemedView style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="hand.tap.fill" size={20} color={tintColor} />
              <ThemedText style={styles.settingLabel}>햅틱 피드백</ThemedText>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: "#767577", true: tintColor + "80" }}
              thumbColor={hapticsEnabled ? tintColor : "#f4f3f4"}
            />
          </ThemedView>
          <ThemedView style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol name="moon.fill" size={20} color={tintColor} />
              <ThemedText style={styles.settingLabel}>다크 모드</ThemedText>
            </View>
            <ThemedText style={styles.settingValue}>
              {colorScheme === "dark" ? "켜짐" : "끔"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* 데이터 관리 */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            데이터 관리
          </ThemedText>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: tintColor }]}
            onPress={handleResetData}
          >
            <IconSymbol name="arrow.counterclockwise" size={20} color={tintColor} />
            <ThemedText style={[styles.actionButtonText, { color: tintColor }]}>
              설정 초기화
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* 정보 */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            정보
          </ThemedText>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>앱 버전</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>저장된 설정</ThemedText>
            <ThemedText style={styles.infoValue}>
              {config ? `${config.rounds.length}개 라운드` : "없음"}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    opacity: 0.7,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
});

