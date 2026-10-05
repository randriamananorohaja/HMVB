import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

const MAPPING: IconMapping = {
  'house.fill': 'home',
  'person.2.fill': 'groups',
  'calendar': 'event',
  'checkmark.circle.fill': 'check-circle',
  'ellipsis': 'more-horiz',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'plus': 'add',
  'qrcode': 'qr-code-2',
  'bell.fill': 'notifications',
  'magnifyingglass': 'search',
  'pencil': 'edit',
  'trash': 'delete',
  'person.fill': 'person',
  'phone.fill': 'phone',
  'envelope.fill': 'email',
  'mappin': 'location-on',
  'clock': 'access-time',
  'gearshape.fill': 'settings',
  'rectangle.portrait.and.arrow.right': 'logout',
  'chart.bar.fill': 'bar-chart',
  'list.bullet': 'list',
  'camera.fill': 'photo-camera',
  'xmark': 'close',
  'checkmark': 'check',
  'person.crop.circle.badge.plus': 'person-add',
  'doc.text': 'description',
  'info.circle': 'info',
  'questionmark.circle': 'help',
  'paintbrush': 'palette',
  'share': 'share',
  'fullscreen': 'fullscreen',
  'arrow.left': 'arrow-back',
  'person.circle': 'account-circle',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const iconName = MAPPING[name] ?? 'help-outline';
  return <MaterialIcons color={color} size={size} name={iconName as any} style={style} />;
}
