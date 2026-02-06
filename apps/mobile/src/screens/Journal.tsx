import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { strings } from "../constants/strings";

const copy = strings.fr;

export function JournalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.modules.journal}</Text>
      <SectionCard
        title="Ressenti & notes"
        description="Échelle simple, fatigue, calme, mobilité, notes libres et tags."
      />
      <SectionCard
        title="Graphiques sobres"
        description="Tendances hebdomadaires sans interprétation médicale."
      />
      <SectionCard
        title="Export & partage"
        description="Export local chiffré, partage avec l’enseignant uniquement en opt-in."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0B0B0D"
  },
  heading: {
    color: "#F2F2F7",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16
  }
});
