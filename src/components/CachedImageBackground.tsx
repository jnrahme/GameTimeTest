import { Image, type ImageContentFit } from 'expo-image';
import { ReactNode } from 'react';
import {
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

// Neutral dark blurhash shown while the remote image loads, so cards never
// flash a blank frame on a slow network.
const PLACEHOLDER_BLURHASH = 'L6Pj0^jE.AyE_3t7t7R**0o#DgR4';

interface CachedImageBackgroundProps {
  uri: string;
  accessibilityLabel: string;
  contentFit?: ImageContentFit;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  children?: ReactNode;
}

/**
 * Drop-in replacement for React Native's `ImageBackground` backed by
 * `expo-image`: memory + disk caching, a blurhash placeholder, and a short
 * fade-in. Remote event artwork is the heaviest thing on these screens, so
 * caching it avoids re-downloads and layout thrash on scroll.
 */
export function CachedImageBackground({
  uri,
  accessibilityLabel,
  contentFit = 'cover',
  style,
  imageStyle,
  children,
}: CachedImageBackgroundProps) {
  return (
    <View style={style}>
      <Image
        accessibilityLabel={accessibilityLabel}
        accessibilityIgnoresInvertColors
        cachePolicy="memory-disk"
        contentFit={contentFit}
        placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
        source={{ uri }}
        style={[StyleSheet.absoluteFill, imageStyle]}
        transition={200}
      />
      {children}
    </View>
  );
}
