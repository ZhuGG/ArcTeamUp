import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type SectionCardProps = {
  title: string;
  description: string;
  footer?: ReactNode;
};

export function SectionCard({ title, description, footer }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
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
