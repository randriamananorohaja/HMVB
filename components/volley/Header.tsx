import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Props = {
  title: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
};

export function Header({ title, showBack, rightIcon, onRightPress, rightElement, transparent }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }, transparent && styles.transparent]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
            <IconSymbol name="chevron.left" size={26} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {rightElement ? (
          rightElement
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} hitSlop={12}>
            <IconSymbol name={rightIcon} size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.header,
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
