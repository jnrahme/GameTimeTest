import { ComponentType } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';

type IconComponent = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

interface ActionButtonProps {
  title: string;
  accessibilityLabel?: string;
  icon?: IconComponent;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

export function ActionButton({
  title,
  accessibilityLabel,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  onPress,
}: ActionButtonProps) {
  const foregroundColor =
    variant === 'primary' ? colors.brandBlack : colors.ink;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled ? styles.pressed : null,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} size="small" />
      ) : (
        <View style={styles.content}>
          {Icon ? (
            <Icon color={foregroundColor} size={18} strokeWidth={2.2} />
          ) : null}
          <Text style={[styles.title, { color: foregroundColor }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.48,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
  },
  title: {
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    fontWeight: '700',
  },
});
