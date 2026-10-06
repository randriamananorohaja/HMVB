import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { getMember, getMemberFees, setMemberFeePaid } from '@/lib/api';
import { MONTHS_FR, type Member, type MemberFee } from '@/lib/types';
import { Header } from '@/components/volley/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EcolageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [member, setMember] = useState<Member | null>(null);
  const [fees, setFees] = useState<MemberFee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const m = await getMember(id);
    setMember(m);
    const f = await getMemberFees(id, year);
    setFees(f);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id, year])
  );

  const toggleMonth = (fee: MemberFee) => {
    const monthName = MONTHS_FR[fee.month - 1];
    const willPay = fee.paid !== 1;
    Alert.alert(
      willPay ? 'Marquer comme payé' : 'Marquer comme non payé',
      `${monthName} ${year}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            await setMemberFeePaid(id, year, fee.month, willPay);
            load();
          },
        },
      ]
    );
  };

  const paidCount = fees.filter((f) => f.paid === 1).length;

  return (
    <View style={styles.container}>
      <Header title="Écolage" showBack />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Text style={styles.memberName}>
            {member ? `${member.first_name} ${member.last_name}` : 'Membre'}
            {member ? ` · #${member.number}` : ''}
          </Text>

          <View style={styles.yearRow}>
            <TouchableOpacity style={styles.yearBtn} onPress={() => setYear((y) => y - 1)}>
              <IconSymbol name="chevron.left" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
            <Text style={styles.yearText}>{year}</Text>
            <TouchableOpacity
              style={styles.yearBtn}
              onPress={() => setYear((y) => Math.min(y + 1, currentYear + 1))}
            >
              <IconSymbol name="chevron.right" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>{paidCount} / 12 mois payés</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${(paidCount / 12) * 100}%` }]} />
            </View>
          </View>

          <Text style={styles.hint}>Appuyez sur un mois pour changer le statut</Text>

          {fees.map((fee) => {
            const paid = fee.paid === 1;
            return (
              <TouchableOpacity
                key={fee.month}
                style={[styles.monthRow, paid && styles.monthPaid]}
                onPress={() => toggleMonth(fee)}
                activeOpacity={0.7}
              >
                <View style={styles.monthLeft}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: paid ? Colors.light.success : Colors.light.danger },
                    ]}
                  />
                  <Text style={styles.monthName}>{MONTHS_FR[fee.month - 1]}</Text>
                </View>
                <Text
                  style={[styles.status, { color: paid ? Colors.light.success : Colors.light.danger }]}
                >
                  {paid ? 'Payé' : 'Non payé'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  yearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearText: { fontSize: 22, fontWeight: '800', color: Colors.light.text },
  summary: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  hint: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginBottom: 12,
    textAlign: 'center',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 8,
  },
  monthPaid: {
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  monthLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  monthName: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
  status: { fontSize: 13, fontWeight: '700' },
});
