import { StyleSheet, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Round, Block, BlockTag } from "@/types/interval";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { RoundEditor } from "./round-editor";
import { useIntervalContext } from "@/contexts/interval-context";

export function IntervalSetup() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const { config, setConfig } = useIntervalContext();

  const [rounds, setRounds] = useState<Round[]>(
    config?.rounds || createDefaultRounds()
  );

  // config가 변경되면 rounds 업데이트
  useEffect(() => {
    if (config?.rounds) {
      setRounds(config.rounds);
    }
  }, [config]);

  function createDefaultRounds(): Round[] {
    return [
      {
        id: "warmup",
        name: "워밍업",
        repeatCount: 1,
        isFixed: true,
        blocks: [
          {
            id: "warmup-block",
            tag: "warmup",
            duration: 300, // 5분
            speed: 8,
          },
        ],
      },
      {
        id: "round-1",
        name: "라운드 1",
        repeatCount: 3,
        blocks: [
          {
            id: "round-1-fast",
            tag: "fast",
            duration: 60, // 1분
            speed: 12,
          },
          {
            id: "round-1-slow",
            tag: "slow",
            duration: 120, // 2분
            speed: 8,
          },
        ],
      },
      {
        id: "round-2",
        name: "라운드 2",
        repeatCount: 3,
        blocks: [
          {
            id: "round-2-fast",
            tag: "fast",
            duration: 90, // 1.5분
            speed: 13,
          },
          {
            id: "round-2-slow",
            tag: "slow",
            duration: 180, // 3분
            speed: 9,
          },
        ],
      },
      {
        id: "cooldown",
        name: "쿨다운",
        repeatCount: 1,
        isFixed: true,
        blocks: [
          {
            id: "cooldown-block",
            tag: "cooldown",
            duration: 300, // 5분
            speed: 7,
          },
        ],
      },
    ];
  }

  const handleAddRound = () => {
    if (rounds.length >= 5) {
      Alert.alert("알림", "라운드는 최대 5개까지 추가할 수 있습니다.");
      return;
    }

    const roundNumber = rounds.filter((r) => !r.isFixed).length + 1;
    const newRound: Round = {
      id: `round-${Date.now()}`,
      name: `라운드 ${roundNumber}`,
      repeatCount: 3,
      blocks: [
        {
          id: `round-${Date.now()}-fast`,
          tag: "fast",
          duration: 60,
          speed: 12,
        },
        {
          id: `round-${Date.now()}-slow`,
          tag: "slow",
          duration: 120,
          speed: 8,
        },
      ],
    };

    // 고정 라운드(쿨다운) 앞에 추가
    const fixedIndex = rounds.findIndex((r) => r.isFixed && r.id === "cooldown");
    if (fixedIndex >= 0) {
      const newRounds = [...rounds];
      newRounds.splice(fixedIndex, 0, newRound);
      setRounds(newRounds);
    } else {
      setRounds([...rounds, newRound]);
    }
  };

  const handleUpdateRound = (roundId: string, updatedRound: Round) => {
    setRounds(rounds.map((r) => (r.id === roundId ? updatedRound : r)));
  };

  const handleDeleteRound = (roundId: string) => {
    Alert.alert(
      "삭제 확인",
      "이 라운드를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            setRounds(rounds.filter((r) => r.id !== roundId));
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      await setConfig({ rounds });
      Alert.alert("저장 완료", "설정이 저장되었습니다.", [
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("저장 실패", "설정 저장 중 오류가 발생했습니다.");
      console.error("Error saving config:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          인터벌 설정
        </ThemedText>

        {rounds.map((round) => (
          <RoundEditor
            key={round.id}
            round={round}
            onUpdate={(updated) => handleUpdateRound(round.id, updated)}
            onDelete={() => handleDeleteRound(round.id)}
            canDelete={!round.isFixed}
          />
        ))}

        {/* 라운드 추가 버튼 */}
        {rounds.filter((r) => !r.isFixed).length < 3 && (
          <TouchableOpacity
            style={[styles.addButton, { borderColor: tintColor }]}
            onPress={handleAddRound}
          >
            <IconSymbol name="plus.circle" size={24} color={tintColor} />
            <ThemedText style={{ color: tintColor, marginLeft: 8 }}>
              라운드 추가
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* 저장 버튼 */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>설정 저장</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderStyle: "dashed",
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

