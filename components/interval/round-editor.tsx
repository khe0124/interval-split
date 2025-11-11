import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Block, BlockTag, Round } from "@/types/interval";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BlockEditor } from "./block-editor";

interface RoundEditorProps {
  round: Round;
  onUpdate: (round: Round) => void;
  onDelete: () => void;
  canDelete?: boolean;
}

export function RoundEditor({
  round,
  onUpdate,
  onDelete,
  canDelete = true,
}: RoundEditorProps) {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const [roundName, setRoundName] = useState(round.name);

  const updateBlock = (blockId: string, updatedBlock: Block) => {
    onUpdate({
      ...round,
      blocks: round.blocks.map((b) => (b.id === blockId ? updatedBlock : b)),
    });
  };

  const deleteBlock = (blockId: string) => {
    onUpdate({
      ...round,
      blocks: round.blocks.filter((b) => b.id !== blockId),
    });
  };

  const addBlock = (tag: BlockTag) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      tag,
      duration: 60, // 기본 1분
      speed: 10, // 기본 10km/h
    };
    onUpdate({
      ...round,
      blocks: [...round.blocks, newBlock],
    });
  };

  const updateRepeatCount = (count: string) => {
    const num = parseInt(count) || 1;
    if (num >= 1 && num <= 100) {
      onUpdate({ ...round, repeatCount: num });
    }
  };

  const updateName = (name: string) => {
    setRoundName(name);
    onUpdate({ ...round, name });
  };

  return (
    <ThemedView style={styles.container}>
      {/* 라운드 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TextInput
            style={[
              styles.roundNameInput,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
            value={roundName}
            onChangeText={updateName}
            placeholder="라운드 이름"
            placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          />
          {!round.isFixed && (
            <View style={styles.repeatContainer}>
              <ThemedText style={styles.repeatLabel}>×</ThemedText>
              <TextInput
                style={[
                  styles.repeatInput,
                  {
                    borderColor: tintColor,
                    color: Colors[colorScheme ?? "light"].text,
                  },
                ]}
                value={round.repeatCount.toString()}
                onChangeText={updateRepeatCount}
                keyboardType="number-pad"
              />
            </View>
          )}
        </View>
        {canDelete && !round.isFixed && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <IconSymbol name="trash" size={20} color={tintColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* 블록 목록 */}
      <ScrollView style={styles.blocksContainer}>
        {round.blocks.map((block) => (
          <BlockEditor
            key={block.id}
            block={block}
            onUpdate={(updated) => updateBlock(block.id, updated)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </ScrollView>

      {/* 블록 추가 버튼 */}
      {!round.isFixed && (
        <View style={styles.addBlockContainer}>
          <ThemedText style={styles.addBlockLabel}>블록 추가:</ThemedText>
          <View style={styles.tagButtons}>
            <TouchableOpacity
              style={[styles.tagButton, { borderColor: tintColor }]}
              onPress={() => addBlock("fast")}
            >
              <ThemedText style={{ color: tintColor, fontSize: 12 }}>
                빠른 구간
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tagButton, { borderColor: tintColor }]}
              onPress={() => addBlock("slow")}
            >
              <ThemedText style={{ color: tintColor, fontSize: 12 }}>
                느린 구간
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  roundNameInput: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  repeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  repeatLabel: {
    fontSize: 16,
  },
  repeatInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 50,
    textAlign: "center",
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  blocksContainer: {
    maxHeight: 400,
  },
  addBlockContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  addBlockLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  tagButtons: {
    flexDirection: "row",
    gap: 8,
  },
  tagButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
