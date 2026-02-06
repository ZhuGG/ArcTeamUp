import { StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { strings } from "../constants/strings";

const copy = strings.fr;

export function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.modules.onboarding}</Text>
      <SectionCard
        title={copy.disclaimerTitle}
        description={copy.disclaimerBody}
      />
      <SectionCard
        title="Profil rapide"
        description="Niveau, dojo/enseignant, objectifs et contraintes. Consentements et partage avec l’enseignant uniquement en opt-in."
      />
      <SectionCard
        title="Rôles & accès"
        description={`${copy.roles.visitor} : découverte. ${copy.roles.practitioner} : séances autorisées + journal. ${copy.roles.teacher} : programmes et feedback.`}
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
