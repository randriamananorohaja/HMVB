import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { MEMBERS, Member } from '@/constants/data';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/components/volley/Avatar';
import { StatusBadge } from '@/components/volley/StatusBadge';

export default function EquipeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = MEMBERS.filter(
    (m) =>
      m.firstName.toLowerCase().includes(query.toLowerCase()) ||
      m.lastName.toLowerCase().includes(query.toLowerCase()) ||
      String(m.number).includes(query)
  );

  const renderItem = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberRow}
      onPress={() => router.push(`/membre/${item.id}`)}
      activeOpacity={0.7}
    >
      <Avatar firstName={item.firstName} lastName={item.lastName} size={48} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.memberPos}>
          #{item.number} · {item.position}
        </Text>
      </View>
      <StatusBadge status={item.status} />
      <IconSymbol name="chevron.right" size={18} color={Colors.light.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Équipe</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <IconSymbol name="magnifyingglass" size={18} color={Colors.light.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un membre..."
              placeholderTextColor={Colors.light.textMuted}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/ajouter-membre')}
          >
            <IconSymbol name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.count}>{MEMBERS.length} membres</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    backgroundColor: Colors.light.header,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
  memberPos: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  separator: { height: 1, backgroundColor: Colors.light.border, marginLeft: 76 },
});
