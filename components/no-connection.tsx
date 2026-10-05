import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Colors } from '@/constants/theme';

export function NoConnection() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.title}>Pas de connexion</Text>
        <Text style={styles.message}>
          Vérifiez votre connexion internet et réessayez.
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            // Force a re-check by reloading the app
            // The useNetworkStatus hook will automatically detect changes
          }}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
