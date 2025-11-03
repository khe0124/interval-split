import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { useState } from "react";
import { Block, BlockTag, BlockTagLabels } from "@/types/interval";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { BlockTagColors } from "@/types/interval";

interface BlockEditorProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: () => void;
}

export function BlockEditor({ block, onUpdate, onDelete }: BlockEditorProps) {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const [durationMinutes, setDurationMinutes] = useState(
    Math.floor(block.duration / 60).toString()
  );
  const [durationSeconds, setDurationSeconds] = useState(
    (block.duration % 60).toString()
  );
  const [speedKmh, setSpeedKmh] = useState(block.speed.toString());

  const updateDuration = (minutes: string, seconds: string) => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    const totalSeconds = mins * 60 + secs;
    onUpdate({ ...block, duration: totalSeconds });
  };

  const updateSpeed = (kmh: string) => {
    const speed = parseFloat(kmh) || 0;
    onUpdate({ ...block, speed });
  };

  const tagColors = BlockTagColors[block.tag];
  const bgColor =
    colorScheme === "dark" ? tagColors.dark : tagColors.light;

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor + "40" }]}>
      {/* 태그 선택 */}
      <View style={styles.tagRow}>
        <ThemedText type="defaultSemiBold" style={styles.tagLabel}>
          {BlockTagLabels[block.tag]}
        </ThemedText>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <IconSymbol name="trash" size={18} color={tintColor} />
        </TouchableOpacity>
      </View>

      {/* 시간 설정 */}
      <View style={styles.settingRow}>
        <ThemedText style={styles.label}>시간</ThemedText>
        <View style={styles.timeInputContainer}>
          <TextInput
            style={[styles.input, { borderColor: tintColor }]}
            value={durationMinutes}
            onChangeText={(text) => {
              setDurationMinutes(text);
              updateDuration(text, durationSeconds);
            }}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          />
          <ThemedText style={styles.unit}>분</ThemedText>
          <TextInput
            style={[styles.input, { borderColor: tintColor }]}
            value={durationSeconds}
            onChangeText={(text) => {
              setDurationSeconds(text);
              updateDuration(durationMinutes, text);
            }}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          />
          <ThemedText style={styles.unit}>초</ThemedText>
        </View>
      </View>

      {/* 속력 설정 */}
      <View style={styles.settingRow}>
        <ThemedText style={styles.label}>속력</ThemedText>
        <View style={styles.speedContainer}>
          <TextInput
            style={[styles.input, styles.speedInput, { borderColor: tintColor }]}
            value={speedKmh}
            onChangeText={(text) => {
              setSpeedKmh(text);
              updateSpeed(text);
            }}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          />
          <ThemedText style={styles.unit}>km/h</ThemedText>
          <ThemedText style={styles.paceText}>
            ({formatPace(parseFloat(speedKmh) || 0)})
          </ThemedText>
        </View>
      </View>
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tagLabel: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  speedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
    textAlign: "center",
    fontSize: 16,
  },
  speedInput: {
    minWidth: 80,
  },
  unit: {
    fontSize: 14,
    opacity: 0.7,
  },
  paceText: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
});

