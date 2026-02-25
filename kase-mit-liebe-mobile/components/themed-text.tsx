import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps & { className?: string }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const typeClasses = {
    default: 'text-base leading-6',
    defaultSemiBold: 'text-base leading-6 font-semibold',
    title: 'text-4xl font-bold leading-tight',
    subtitle: 'text-xl font-bold',
    link: 'text-base leading-7 text-[#0a7ea4]',
  };

  return (
    <Text
      style={[{ color }, style]}
      className={`${typeClasses[type]} ${className || ''}`}
      {...rest}
    />
  );
}
