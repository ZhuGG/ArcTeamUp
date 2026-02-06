import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { strings } from "./src/constants/strings";
import { SectionCard } from "./src/components/SectionCard";

const copy = strings.fr;

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 840;
  const isCompact = width < 420;

  const highlights = copy.trust;

  const modules = [
    {
      title: copy.modules.onboarding,
      description:
        "Onboarding, consentements, profil, et rappel des limites non médicales.",
      badge: "Fondation"
    },
    {
      title: copy.modules.agenda,
      description: "Calendrier, rappels locaux, rituel de début/fin de séance.",
      badge: "Rythme"
    },
    {
      title: copy.modules.sessions,
      description: "Séances guidées par blocs, consignes textuelles et timers.",
      badge: "Pratique"
    },
    {
      title: copy.modules.library,
      description: "Bibliothèque structurée avec recherche, filtres et contenus.",
      badge: "Ressources"
    },
    {
      title: copy.modules.journal,
      description: "Journal de pratique sensible avec export local chiffré.",
      badge: "Réflexion"
    },
    {
      title: copy.modules.teacher,
      description: "Programmes, attributions, retours et bibliothèque étendue.",
      badge: "Transmission"
    }
  ];

  const ritualSteps = [
    {
      title: "Accueil corporel",
      description: "Ancrage doux, respiration longue, état de sécurité."
    },
    {
      title: "Échauffement spiralé",
      description: "Mobilité des hanches, épaules et ligne centrale."
    },
    {
      title: "Séquence guidée",
      description: "Blocs lents, respiration, visualisation et repos actif."
    },
    {
      title: "Intégration",
      description: "Journal, gratitude, repères pour la prochaine séance."
    }
  ];

  const pillars = [
    "Stabilité",
    "Écoute",
    "Fluidité",
    "Présence",
    "Régularité",
    "Soutien"
  ];

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundRing} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: isWide ? 36 : 20 }
        ]}
      >
        <View style={[styles.hero, isWide && styles.heroWide]}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Pratique guidée & éthique</Text>
            </View>
            <Text style={[styles.title, isCompact && styles.titleCompact]}>
              {copy.appName}
            </Text>
            <Text style={styles.tagline}>{copy.tagline}</Text>
            <Text style={styles.subtitle}>
              Compagnon sobre, éthique et encadré pour la pratique de
              l’Aikishintaiso. Interface optimisée pour mobile et bureau.
            </Text>
            <View style={styles.heroActions}>
              <View style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{copy.ctaPrimary}</Text>
              </View>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  {copy.ctaSecondary}
                </Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>Mode sombre</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>Hors ligne</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>Respect des données</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>Guides audio</Text>
              </View>
            </View>
          </View>
          <View style={styles.heroPanel}>
            <View style={styles.panelHeaderRow}>
              <Text style={styles.panelTitle}>{copy.experienceTitle}</Text>
              <View style={styles.panelBadge}>
                <Text style={styles.panelBadgeText}>18 min</Text>
              </View>
            </View>
            {highlights.map((item) => (
              <View key={item.label} style={styles.panelItem}>
                <Text style={styles.panelItemLabel}>{item.label}</Text>
                <Text style={styles.panelItemValue}>{item.value}</Text>
              </View>
            ))}
            <View style={styles.panelFooter}>
              <Text style={styles.panelFooterText}>
                Dernière séance · 2 jours · Respiration longue
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.quickStart, isWide && styles.quickStartWide]}>
          <SectionCard
            title={copy.quickStart.title}
            description={copy.quickStart.steps.join("\n")}
            badge="Essentiel"
            tone="elevated"
          />
          <SectionCard
            title={copy.reassurance.title}
            description={copy.reassurance.body}
            badge="Local"
            tone="muted"
          />
          <SectionCard
            title={copy.companion.title}
            description={copy.companion.body}
            badge="Calme"
            tone="muted"
          />
        </View>

        <View style={styles.ritualCard}>
          <View style={styles.ritualHeader}>
            <Text style={styles.ritualTitle}>Rituel complet guidé</Text>
            <Text style={styles.ritualSubtitle}>
              Une progression douce pensée pour la mobilité, la respiration et
              l’intégration mentale.
            </Text>
          </View>
          <View style={styles.ritualSteps}>
            {ritualSteps.map((step, index) => (
              <View key={step.title} style={styles.ritualStep}>
                <View style={styles.ritualIndex}>
                  <Text style={styles.ritualIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.ritualCopy}>
                  <Text style={styles.ritualStepTitle}>{step.title}</Text>
                  <Text style={styles.ritualStepDescription}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <SectionCard
          title={copy.disclaimerTitle}
          description={copy.disclaimerBody}
          badge="Important"
          tone="elevated"
        />

        <View style={[styles.sectionHeader, isWide && styles.sectionHeaderWide]}>
          <Text style={styles.sectionTitle}>{copy.modulesTitle}</Text>
          <Text style={styles.sectionSubtitle}>{copy.modulesSubtitle}</Text>
        </View>
        <View style={[styles.grid, isWide && styles.gridWide]}>
          {modules.map((module) => (
            <View
              key={module.title}
              style={[styles.gridItem, isWide && styles.gridItemWide]}
            >
              <SectionCard
                title={module.title}
                description={module.description}
                badge={module.badge}
              />
            </View>
          ))}
        </View>

        <View style={styles.pillarsSection}>
          <Text style={styles.pillarsTitle}>
            Les piliers qui soutiennent la pratique
          </Text>
          <Text style={styles.pillarsSubtitle}>
            Des rappels simples pour garder l’esprit, le corps et la respiration
            alignés sur l’intention.
          </Text>
          <View style={styles.pillarsGrid}>
            {pillars.map((pillar) => (
              <View key={pillar} style={styles.pillarChip}>
                <Text style={styles.pillarChipText}>{pillar}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#070709"
  },
  backgroundGlow: {
    position: "absolute",
    top: -120,
    left: -40,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "rgba(94,94,232,0.18)"
  },
  backgroundRing: {
    position: "absolute",
    right: -120,
    top: 120,
    width: 240,
    height: 240,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  container: {
    paddingTop: 28,
    paddingBottom: 40
  },
  hero: {
    backgroundColor: "#111116",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  heroWide: {
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
    padding: 28
  },
  heroHeader: {
    flex: 1
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12
  },
  heroBadgeText: {
    color: "#F2F2F7",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4
  },
  title: {
    color: "#F2F2F7",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10
  },
  titleCompact: {
    fontSize: 26
  },
  tagline: {
    color: "#E8E8FF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10
  },
  subtitle: {
    color: "#D1D1D6",
    fontSize: 15,
    lineHeight: 22
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  primaryButton: {
    backgroundColor: "#6363F1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)"
  },
  secondaryButtonText: {
    color: "#F2F2F7",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16
  },
  metaChip: {
    backgroundColor: "rgba(88,88,214,0.2)",
    borderColor: "rgba(88,88,214,0.4)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  metaChipText: {
    color: "#E8E8FF",
    fontSize: 12,
    fontWeight: "500"
  },
  heroPanel: {
    backgroundColor: "rgba(12,12,16,0.78)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginTop: 20
  },
  panelHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  panelTitle: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12
  },
  panelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(99,99,241,0.22)",
    borderWidth: 1,
    borderColor: "rgba(99,99,241,0.5)"
  },
  panelBadgeText: {
    color: "#E8E8FF",
    fontSize: 11,
    fontWeight: "600"
  },
  panelItem: {
    marginBottom: 12
  },
  panelItemLabel: {
    color: "#F2F2F7",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4
  },
  panelItemValue: {
    color: "#C7C7CC",
    fontSize: 13,
    lineHeight: 18
  },
  panelFooter: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)"
  },
  panelFooterText: {
    color: "#B7B7C2",
    fontSize: 12
  },
  quickStart: {
    gap: 12,
    marginBottom: 8
  },
  quickStartWide: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  ritualCard: {
    backgroundColor: "#15151B",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  ritualHeader: {
    marginBottom: 12
  },
  ritualTitle: {
    color: "#F2F2F7",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6
  },
  ritualSubtitle: {
    color: "#C7C7CC",
    fontSize: 13,
    lineHeight: 19
  },
  ritualSteps: {
    gap: 12
  },
  ritualStep: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(10,10,14,0.6)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)"
  },
  ritualIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(99,99,241,0.2)",
    borderWidth: 1,
    borderColor: "rgba(99,99,241,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  ritualIndexText: {
    color: "#E8E8FF",
    fontWeight: "600",
    fontSize: 12
  },
  ritualCopy: {
    flex: 1
  },
  ritualStepTitle: {
    color: "#F2F2F7",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4
  },
  ritualStepDescription: {
    color: "#C7C7CC",
    fontSize: 12,
    lineHeight: 17
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 16
  },
  sectionHeaderWide: {
    maxWidth: 720,
    alignSelf: "center",
    textAlign: "center"
  },
  sectionTitle: {
    color: "#F2F2F7",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6
  },
  sectionSubtitle: {
    color: "#C7C7CC",
    fontSize: 14,
    lineHeight: 20
  },
  grid: {
    gap: 12
  },
  gridWide: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  gridItem: {
    flexGrow: 1
  },
  gridItemWide: {
    flexBasis: "48%"
  },
  pillarsSection: {
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(12,12,16,0.7)"
  },
  pillarsTitle: {
    color: "#F2F2F7",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6
  },
  pillarsSubtitle: {
    color: "#C7C7CC",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12
  },
  pillarsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  pillarChip: {
    backgroundColor: "rgba(88,88,214,0.18)",
    borderWidth: 1,
    borderColor: "rgba(88,88,214,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },
  pillarChipText: {
    color: "#E8E8FF",
    fontSize: 12,
    fontWeight: "600"
  }
});
