export const colors = {
  paper: '#efead7',
  cream: '#f8f3e4',
  crumb: '#e95a35',
  toast: '#bdaa72',
  sand: '#c8bb96',
  bark: '#924e0d',
  ink: '#3b2a1a',
  muted: '#9c8f70',
  caption: '#8c7a5e',
  taupe: '#6b5e42',
  plum: '#ae71ad',
  white: '#ffffff',
  track: '#e3d9bc',
  toggleOff: '#c9bbaa',
  scrim: 'rgba(0, 0, 0, 0.47)',
  toastLine: 'rgba(189, 170, 114, 0.38)',
  toastWash: 'rgba(189, 170, 114, 0.19)',
} as const;

export const mapColors = {
  ground: '#ede8d8',
  block: '#d9d1ba',
  street: '#d6ceb8',
  park: '#b8c9a3',
  label: colors.caption,
  parkLabel: '#667952',
} as const;

export const fonts = {
  display: 'Gloock_400Regular',
  body: 'Geom_400Regular',
  bodyMedium: 'Geom_500Medium',
  bodySemiBold: 'Geom_600SemiBold',
  bodyBold: 'Geom_700Bold',
} as const;

export const radii = {
  card: 10,
  control: 12,
  button: 14,
  pill: 28,
} as const;

export const shadows = {
  raised: '0px 3px 10px 0px rgba(59, 42, 26, 0.13)',
  soft: '0px 3px 10px 0px rgba(59, 42, 26, 0.08)',
  lifted: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
} as const;

export const layout = {
  statusBarHeight: 62,
  tabBarIconSize: 31,
  tabBarBottom: 19,
  tabBarClearance: 122,
} as const;
