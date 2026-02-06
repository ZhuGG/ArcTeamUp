import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { strings } from "../constants/strings";

const copy = strings.fr;

export function SessionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.modules.sessions}</Text>
      <SectionCard
        title="Blocs guidés"
        description="Préparation, kihon (optionnel), postures/marches/méditations, retour au calme, notes."
      />
      <SectionCard
        title="Sécurité"
        description="Consignes claires, arrêt en cas de douleur, et accès aux contenus sensibles réservé à la supervision." 
      />
      <SectionCard
        title="Audio optionnel"
        description="Textes lisibles + TTS optionnel (sans ton médical)."
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
