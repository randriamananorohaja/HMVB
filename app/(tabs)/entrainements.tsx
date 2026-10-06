import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import {
  getActiveTrainingsWithStats as getTrainingsWithStats,
  deleteTraining,
  formatDateFr,
  isToday,
  type TrainingWithStats,
} from '@/lib/api';
// deleteTraining available from api
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/volley/ProgressBar';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { EmptyState } from '@/components/volley/EmptyState';

export default function EntrainementsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [trainings, setTrainings] = useState<TrainingWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await getTrainingsWithStats();
    setTrainings(data);
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const renderItem = ({ item }: { item: TrainingWithStats }) => {
    const rate =
      item.total_members > 0
        ? Math.round((item.presents / item.total_members) * 100)
        : 0;
    const today = isToday(item.date);

    return (
      <TouchableOpacity
        style={[styles.card, today && styles.cardToday]}
        onPress={() => router.push(`/entrainement/${item.id}`)}
        onLongPress={() => {
          Alert.alert(
            'Actions',
            `${item.date} · ${item.start_time}`,
            [
              {
                text: 'Modifier',
                onPress: () => router.push(`/modifier-entrainement/${item.id}`),
              },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  Alert.alert(
                    'Confirmer',
                    'Supprimer cet entraînement ?',
                    [
                      { text: 'Annuler', style: 'cancel' },
                      {
                        text: 'Supprimer',
                        style: 'destructive',
                        onPress: async () => {
                          await deleteTraining(item.id);
                          load();
                        },
                      },
                    ]
                  );
                },
              },
              { text: 'Annuler', style: 'cancel' },
            ]
          );
        }}
        activeOpacity={0.75}
      >
        <View style={styles.cardHeader}>
          <View style={styles.dateRow}>
            <IconSymbol
              name="calendar"
              size={16}
              color={today ? Colors.light.primary : Colors.light.textSecondary}
            />
            <Text style={[styles.dateText, today && styles.dateToday]}>
              {today ? "Aujourd'hui" : formatDateFr(item.date)}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {item.start_time} – {item.end_time}
          </Text>
        </View>

        <View style={styles.locRow}>
          <IconSymbol name="mappin" size={14} color={Colors.light.textSecondary} />
          <Text style={styles.locText}>{item.location || 'Lieu non défini'}</Text>
        </View>

        {item.total_members > 0 ? (
          <>
            <View style={styles.presenceRow}>
              <Text style={styles.presenceCount}>
                {item.presents} / {item.total_members} présents
              </Text>
              <Text style={styles.presencePct}>{rate}%</Text>
            </View>
            <ProgressBar progress={rate} height={8} />
            {today && (
              <PrimaryButton
                title="QR Présence"
                icon="qrcode"
                onPress={() => router.push(`/qr-coach?id=${item.id}`)}
                style={{ marginTop: 12 }}
              />
            )}
          </>
        ) : (
          <Text style={styles.membersCount}>Aucun membre dans l'équipe</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <View style={styles.navBtn} />
          <Text style={styles.headerTitle}>Entraînements</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/ajouter-entrainement')}
          >
            <IconSymbol name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={trainings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          <EmptyState
            message={"Aucune donnée enregistrée\nCréez votre premier entraînement"}
            icon="calendar"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { alignItems: 'center', justifyContent: 'center' },
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
  navBtn: { width: 40, height: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
  cardToday: { borderWidth: 1.5, borderColor: Colors.light.primary },
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
