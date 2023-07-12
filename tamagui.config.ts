import { createAnimations } from '@tamagui/animations-react-native'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens as defaultTokens } from '@tamagui/themes'
import { createFont, createTamagui, createTokens } from 'tamagui'

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100
  },

  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60
  },

  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250
  }
})

const headingFont = createInterFont({
  weight: {
    400: '400',
    600: '600'
  }
})

const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    moderator: '#77d57a',
    admin: '#ff6568',
    originalPoster: '#003bff',

    primary: '#FF4500',
    secondary: '#FF4500',

    errorBackground: '#FFD2D2',
    errorText: 'black',
    contentBackgroundLight: '#FFFFFF',
    contentBackgroundDark: '#1A1A1A',

    backgroundLight: '#D8DEE9',
    backgroundDark: '#000000',

    darkText: '#000000',
    lightText: '#FFFFFF',
    fadedLightText: '#9AA5B1',
    fadedDarkText: '#9AA5B1'
  },
  size: {
    true: 16,
    '0.25': 4,
    '0.5': 8,
    '0.75': 12,
    '1': 16,
    '1.5': 24,
    '2': 32,
    '3': 64,
    '4': 128
  },
  space: {
    true: 16,
    '0.25': 4,
    '0.5': 8,
    '1': 16,
    '2': 32
  }
})

const bodyFont = createFont({
  family: 'Helvetica',
  weight: {
    true: '400',
    400: '400',
    600: '600'
  },
  size: tokens.size
})

const config = createTamagui({
  animations,
  defaultTheme: 'dark',
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    true: bodyFont,
    heading: headingFont,
    body: bodyFont
  },
  themes: {
    ...themes,
    light: {
      ...themes.light,
      primaryColor: tokens.color.primary,
      moderatorColor: tokens.color.moderator,
      adminColor: tokens.color.admin,
      opColor: tokens.color.originalPoster,
      background: tokens.color.backgroundLight,
      contentBackground: tokens.color.contentBackgroundLight,
      fadedText: tokens.color.fadedLightText,
      textColor: tokens.color.darkText,
      errorBackground: tokens.color.errorBackground,
      errorText: tokens.color.errorText,
      linkColor: tokens.color.primary
    },
    dark: {
      ...themes.dark,
      primaryColor: tokens.color.primary,
      moderatorColor: tokens.color.moderator,
      adminColor: tokens.color.admin,
      opColor: tokens.color.originalPoster,
      background: tokens.color.backgroundDark,
      contentBackground: tokens.color.contentBackgroundDark,
      fadedText: tokens.color.fadedDarkText,
      textColor: tokens.color.lightText,
      errorBackground: tokens.color.errorBackground,
      errorText: tokens.color.errorText,
      linkColor: tokens.color.primary
    }
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' }
  })
})

export type AppConfig = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
export default config
