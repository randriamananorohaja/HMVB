import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { TRAININGS, Training, formatDateFr } from '@/constants/data';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';

export default function EntrainementsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderItem = ({ item, index }: { item: Training; index: number }) => {
    const rate = Math.round((item.presents / item.totalMembers) * 100);
    const isToday = index === 0;

    return (
      <TouchableOpacity
        style={[styles.card, isToday && styles.cardToday]}
        onPress={() => router.push(`/entrainement/${item.id}`)}
        activeOpacity={0.75}
      >
        <View style={styles.cardHeader}>
          <View style={styles.dateRow}>
            <IconSymbol
              name="calendar"
              size={16}
              color={isToday ? Colors.light.primary : Colors.light.textSecondary}
            />
            <Text style={[styles.dateText, isToday && styles.dateToday]}>
              {isToday ? "Aujourd'hui" : formatDateFr(item.date)}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {item.startTime} – {item.endTime}
          </Text>
        </View>

        <View style={styles.locRow}>
          <IconSymbol name="mappin" size={14} color={Colors.light.textSecondary} />
          <Text style={styles.locText}>{item.location}</Text>
        </View>

        {isToday ? (
          <>
            <View style={styles.presenceRow}>
              <Text style={styles.presenceCount}>
                {item.presents} / {item.totalMembers} présents
              </Text>
              <Text style={styles.presencePct}>{rate}%</Text>
            </View>
            <ProgressBar progress={rate} height={8} />
            <PrimaryButton
              title="QR Présence"
              icon="qrcode"
              onPress={() => router.push(`/qr-coach?id=${item.id}`)}
              style={{ marginTop: 12 }}
            />
          </>
        ) : (
          <Text style={styles.membersCount}>{item.totalMembers} membres</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.navBtn}>
            <IconSymbol name="chevron.left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Entraînements</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/ajouter-entrainement')}
          >
            <IconSymbol name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.monthLabel}>Octobre 2026</Text>
      </View>

      <FlatList
        data={TRAININGS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardToday: {
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary },
  dateToday: { color: Colors.light.primary },
  timeText: { fontSize: 13, color: Colors.light.textSecondary },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  locText: { fontSize: 13, color: Colors.light.textSecondary },
  presenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  presenceCount: { fontSize: 13, fontWeight: '600', color: Colors.light.text },
  presencePct: { fontSize: 13, fontWeight: '700', color: Colors.light.success },
  membersCount: { fontSize: 13, color: Colors.light.textMuted },
});
