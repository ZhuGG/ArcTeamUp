import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { strings } from "../constants/strings";

const copy = strings.fr;

export function TeacherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.modules.teacher}</Text>
      <SectionCard
        title="Programmes"
        description="Création de templates par blocs, progression, fréquence."
      />
      <SectionCard
        title="Attributions"
        description="Assignation à des élèves/groupes avec suivi de complétion."
      />
      <SectionCard
        title="Carnet enseignant"
        description="Notes privées et retours partagés (opt-in côté élève)."
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
