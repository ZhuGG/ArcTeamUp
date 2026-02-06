import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { strings } from "../constants/strings";

const copy = strings.fr;

export function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.modules.library}</Text>
      <SectionCard
        title="Contenus structurés"
        description="Postures, marches, mouvements, méditations, kihon, thèmes et programmes."
      />
      <SectionCard
        title="Filtres & favoris"
        description="Recherche par niveau, tags, axe, respiration, équilibre."
      />
      <SectionCard
        title="Accès encadré"
        description="Les éléments non autorisés en autonomie sont protégés par le rôle enseignant ou une attribution."
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
