import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = {
  status: 'actif' | 'desactive' | 'present' | 'retard' | 'absent';
  size?: 'sm' | 'md';
};

const CONFIG = {
  actif: { label: 'Actif', color: Colors.light.success, bg: '#DCFCE7' },
  desactive: { label: 'Désactivé', color: Colors.light.textMuted, bg: '#F3F4F6' },
  present: { label: 'Présent', color: Colors.light.success, bg: '#DCFCE7' },
  retard: { label: 'En retard', color: Colors.light.warning, bg: '#FEF3C7' },
  absent: { label: 'Absent', color: Colors.light.danger, bg: '#FEE2E2' },
};

export function StatusBadge({ status, size = 'sm' }: Props) {
  const cfg = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'md' && styles.badgeMd]}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.text, { color: cfg.color }, size === 'md' && styles.textMd]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  textMd: {
    fontSize: 13,
  },
});
