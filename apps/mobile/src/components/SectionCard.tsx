import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type SectionCardProps = {
  title: string;
  description: string;
  badge?: string;
  footer?: ReactNode;
};

export function SectionCard({
  title,
  description,
  badge,
  footer
}: SectionCardProps) {
  return (
    <View style={styles.card}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 12
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(88,88,214,0.16)",
    borderColor: "rgba(88,88,214,0.5)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10
  },
  badgeText: {
    color: "#E8E8FF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3
  },
  title: {
    color: "#F2F2F7",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8
  },
  description: {
    color: "#D1D1D6",
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    marginTop: 12
  }
});
