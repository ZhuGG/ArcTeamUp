import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { strings } from "../constants/strings";

const copy = strings.fr;

export function AgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.modules.agenda}</Text>
      <SectionCard
        title="Calendrier"
        description="Cours du dojo, pratiques à domicile, stages et événements."
      />
      <SectionCard
        title="Rappels intelligents"
        description="Notifications locales configurables avec respect du rythme personnel."
      />
      <SectionCard
        title="Rituel de séance"
        description="Check-in, respiration, intention de début et retour au calme en fin de séance."
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
