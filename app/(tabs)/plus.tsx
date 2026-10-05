import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '@/constants/theme';
import { TEAM } from '@/constants/data';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/components/volley/Avatar';

type MenuItem = {
  icon: string;
  label: string;
  value?: string;
  route?: string;
  danger?: boolean;
};

const MENU: { section: string; items: MenuItem[] }[] = [
  {
    section: 'Mon compte',
    items: [
      { icon: 'person.fill', label: 'Rakoto Andry', value: 'coach@volleyteam.mg', route: '/profil-coach' },
    ],
  },
  {
    section: '',
    items: [
      { icon: 'person.2.fill', label: 'Équipe', value: TEAM.name, route: '/profil-equipe' },
      { icon: 'bell.fill', label: 'Notifications', value: 'Activées', route: '/notifications' },
      { icon: 'qrcode', label: "QR code de l'entraînement", value: 'Mode par défaut : coach', route: '/qr-coach' },
      { icon: 'paintbrush', label: 'Apparence', value: 'Système' },
      { icon: 'questionmark.circle', label: 'Aide & support' },
      { icon: 'info.circle', label: 'À propos' },
    ],
  },
];

export default function PlusScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {MENU.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.section ? (
              <Text style={styles.sectionTitle}>{section.section}</Text>
            ) : null}
            <View style={styles.card}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.row, i < section.items.length - 1 && styles.rowBorder]}
                  onPress={() => item.route && router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconWrap}>
                    <IconSymbol name={item.icon} size={20} color={Colors.light.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    {item.value ? (
                      <Text style={styles.rowValue}>{item.value}</Text>
                    ) : null}
                  </View>
                  <IconSymbol name="chevron.right" size={18} color={Colors.light.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={Colors.light.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { fontSize: 15, fontWeight: '500', color: Colors.light.text },
  rowValue: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 28,
    paddingVertical: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: Radius.md,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: Colors.light.danger },
});
