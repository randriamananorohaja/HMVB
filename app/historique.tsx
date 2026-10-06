import { EmptyState } from '@/components/volley/EmptyState';
import { Header } from '@/components/volley/Header';
import { PrimaryButton } from '@/components/volley/PrimaryButton';
import { StatusBadge } from '@/components/volley/StatusBadge';
import { Colors, Radius } from '@/constants/theme';
import { getSeasonHistory, historyToCsv, type HistoryRow } from '@/lib/api';
import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * Télécharge / enregistre le CSV localement (pas de partage ni d'envoi).
 * - Android : dossier choisi via le gestionnaire de fichiers (Téléchargements, etc.)
 * - iOS / autres : dossier Documents de l'application
 */
async function downloadCsv(csv: string, filename: string): Promise<string> {
  // Android : laisser l'utilisateur choisir où enregistrer (ex. Téléchargements)
  if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const uri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        'text/csv'
      );
      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      return uri;
    }
    // Permission refusée → fallback Documents app
  }

  const base =
    FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
  const path = `${base}${filename}`;
  await FileSystem.writeAsStringAsync(path, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return path;
}

export default function HistoriqueScreen() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getSeasonHistory();
        setRows(data);
        setLoading(false);
      })();
    }, [])
  );

  const exportExcel = async () => {
    if (rows.length === 0) {
      Alert.alert('Export', 'Aucune donnée à exporter');
      return;
    }
    setExporting(true);
    try {
      const csv = historyToCsv(rows);
      const filename = `historique_presences_${new Date().toISOString().slice(0, 10)}.csv`;
      const savedPath = await downloadCsv(csv, filename);

      Alert.alert(
        'Téléchargement terminé',
        Platform.OS === 'android'
          ? `Fichier enregistré :\n${filename}\n\nOuvrez-le avec Excel ou Google Sheets.`
          : `Fichier enregistré dans l'application :\n${filename}`,
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('Erreur export', String(e));
    } finally {
      setExporting(false);
    }
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
      <Header title="Historique des présences" showBack />
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {rows.length} ligne{rows.length !== 1 ? 's' : ''}
        </Text>
        <PrimaryButton
          title={exporting ? 'Téléchargement…' : 'Télécharger Excel (CSV)'}
          icon="arrow.down.circle"
          onPress={exportExcel}
          disabled={exporting || rows.length === 0}
          style={{ paddingVertical: 10, paddingHorizontal: 14 }}
        />
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item, i) => `${item.training_id}-${item.member_id}-${i}`}
        contentContainerStyle={{ padding: 12, flexGrow: 1, paddingBottom: 40 }}
        ListEmptyComponent={
          <EmptyState message="Aucune donnée enregistrée" icon="chart.bar.fill" />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.first_name} {item.last_name} · #{item.number}
              </Text>
              <Text style={styles.meta}>
                {item.date} · {item.start_time}–{item.end_time}
                {item.location ? ` · ${item.location}` : ''}
              </Text>
            </View>
            <StatusBadge status={item.status as any} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  count: { fontSize: 13, color: Colors.light.textSecondary, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  name: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  meta: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
});