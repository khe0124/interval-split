import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 현재 날짜 정보
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  // 월 변경 함수
  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setSelectedDate(newDate);
  };

  // 월의 첫 번째 날짜와 마지막 날짜
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 캘린더 날짜 배열 생성
  const calendarDays = [];

  // 빈 칸 추가 (월의 첫 날짜 이전)
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 날짜 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            캘린더
          </ThemedText>
        </View>

        {/* 월 선택 헤더 */}
        <ThemedView style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => changeMonth("prev")}
            style={styles.monthButton}
          >
            <IconSymbol name="chevron.left" size={24} color={tintColor} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.monthText}>
            {currentYear}년 {monthNames[currentMonth]}
          </ThemedText>
          <TouchableOpacity
            onPress={() => changeMonth("next")}
            style={styles.monthButton}
          >
            <IconSymbol name="chevron.right" size={24} color={tintColor} />
          </TouchableOpacity>
        </ThemedView>

        {/* 캘린더 그리드 */}
        <ThemedView style={styles.calendarCard}>
          {/* 요일 헤더 */}
          <View style={styles.weekDayHeader}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDay}>
                <ThemedText
                  style={[
                    styles.weekDayText,
                    index === 0 && { color: "#ff4444" },
                    index === 6 && { color: "#4444ff" },
                  ]}
                >
                  {day}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={styles.dateGrid}>
            {calendarDays.map((day, index) => {
              const today = new Date();
              const isToday =
                day !== null &&
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonth &&
                today.getDate() === day;

              if (day === null) {
                return <View key={index} style={styles.dateCell} />;
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCell,
                    isToday && [styles.todayCell, { borderColor: tintColor }],
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.dateText,
                      isToday && { color: tintColor, fontWeight: "bold" },
                    ]}
                  >
                    {day}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ThemedView>

        {/* 선택된 날짜의 운동 기록 */}
        <ThemedView style={styles.recordCard}>
          <ThemedText type="subtitle" style={styles.recordTitle}>
            운동 기록
          </ThemedText>
          <View style={styles.recordList}>
            <ThemedText style={styles.emptyText}>
              이 날짜에 운동 기록이 없습니다.
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
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
  },
  calendarCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  weekDayHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  dateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  todayCell: {
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  dateText: {
    fontSize: 16,
  },
  recordCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  recordTitle: {
    marginBottom: 16,
  },
  recordList: {
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: "center",
  },
});
