import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { strings } from "./src/constants/strings";
import { SectionCard } from "./src/components/SectionCard";

const copy = strings.fr;

export default function App() {
  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{copy.appName}</Text>
        <Text style={styles.subtitle}>
          Compagnon sobre, éthique et encadré pour la pratique de l’Aikishintaiso.
        </Text>
        <SectionCard
          title={copy.disclaimerTitle}
          description={copy.disclaimerBody}
        />
        <SectionCard
          title={copy.modules.onboarding}
          description="Onboarding, consentements, profil, et rappel des limites non médicales."
        />
        <SectionCard
          title={copy.modules.agenda}
          description="Calendrier, rappels locaux, rituel de début/fin de séance."
        />
        <SectionCard
          title={copy.modules.sessions}
          description="Séances guidées par blocs, consignes textuelles, timers et sécurité."
        />
        <SectionCard
          title={copy.modules.library}
          description="Bibliothèque structurée avec recherche, filtres et contenus gated."
        />
        <SectionCard
          title={copy.modules.journal}
          description="Journal de pratique sensible avec export local chiffré."
        />
        <SectionCard
          title={copy.modules.teacher}
          description="Programmes, attributions, retours et bibliothèque étendue."
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#0B0B0D"
  },
  container: {
    padding: 20
  },
  title: {
    color: "#F2F2F7",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8
  },
  subtitle: {
    color: "#D1D1D6",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16
  }
});
