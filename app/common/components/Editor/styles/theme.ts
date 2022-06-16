const colors = {
  almostBlack: 'rgb(20, 20, 20)',
  lightBlack: '#2F3336',
  almostWhite: '#E6E6E6',
  white: 'rgb(255, 255, 255,0.8)',
  white10: 'rgba(255, 255, 255, 0.1)',
  black: '#000',
  black10: 'rgba(0, 0, 0, 0.1)',
  primary: '#1AB6FF',
  greyLight: '#F4F7FA',
  grey: '#E8EBED',
  greyMid: '#C5CCD3',
  greyDark: '#DAE1E9',
  purple: 'rgb(191, 90, 242,0.7)',
};

export const base = {
  ...colors,
  fontFamily: 'Inter',
  fontFamilyMono:
    "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace",
  fontWeight: 500,
  zIndex: 100,
  link: colors.primary,
  placeholder: '#B1BECC',
  textSecondary: '#4E5C6E',
  textLight: colors.white,
  textHighlight: '#b3e7ff',
  textHighlightForeground: colors.black,
  selected: colors.primary,
  codeComment: '#6a737d',
  codePunctuation: '#5e6687',
  codeNumber: '#d73a49',
  codeProperty: '#c08b30',
  codeTag: '#3d8fd1',
  codeString: '#032f62',
  codeSelector: '#6679cc',
  codeAttr: '#c76b29',
  codeEntity: '#22a2c9',
  codeKeyword: '#d73a49',
  codeFunction: '#6f42c1',
  codeStatement: '#22a2c9',
  codePlaceholder: '#3d8fd1',
  codeInserted: '#202746',
  codeImportant: '#c94922',

  blockToolbarBackground: colors.almostBlack,
  blockToolbarTrigger: colors.white,
  blockToolbarTriggerIcon: colors.purple,
  blockToolbarItem: colors.white,
  blockToolbarIcon: undefined,
  blockToolbarIconSelected: colors.white,
  blockToolbarText: colors.white,
  blockToolbarTextSelected: colors.almostBlack,
  blockToolbarSelectedBackground: colors.purple,
  blockToolbarHoverBackground: colors.greyLight,
  blockToolbarDivider: colors.purple,

  noticeInfoBackground: '#F5BE31',
  noticeInfoText: colors.almostBlack,
  noticeTipBackground: '#9E5CF7',
  noticeTipText: colors.white,
  noticeWarningBackground: '#FF5C80',
  noticeWarningText: colors.white,
};

export const light = {
  ...base,
  background: colors.white,
  text: colors.almostBlack,
  code: colors.lightBlack,
  cursor: colors.black,
  divider: colors.greyMid,

  toolbarBackground: colors.lightBlack,
  toolbarHoverBackground: colors.black,
  toolbarInput: colors.white10,
  toolbarItem: colors.white,

  tableDivider: colors.greyMid,
  tableSelected: colors.primary,
  tableSelectedBackground: '#E5F7FF',

  quote: colors.purple,
  codeBackground: colors.greyLight,
  codeBorder: colors.grey,
  horizontalRule: colors.greyMid,
  imageErrorBackground: colors.greyLight,

  scrollbarBackground: colors.white,
  scrollbarThumb: colors.white,
};

export const dark = {
  ...base,
  background: colors.almostBlack,
  text: colors.almostWhite,
  code: colors.almostWhite,
  cursor: colors.white,
  divider: '#4E5C6E',
  placeholder: 'rgb(255, 255, 255,0.4)',

  toolbarBackground: colors.almostBlack,
  toolbarHoverBackground: colors.white,
  toolbarInput: colors.white,
  toolbarItem: colors.white,

  tableDivider: colors.lightBlack,
  tableSelected: colors.primary,
  tableSelectedBackground: '#002333',

  quote: colors.greyDark,
  codeBackground: colors.black,
  codeBorder: colors.lightBlack,
  codeString: '#3d8fd1',
  horizontalRule: colors.lightBlack,
  imageErrorBackground: 'rgba(0, 0, 0, 0.5)',

  scrollbarBackground: colors.black,
  scrollbarThumb: colors.black,
};

export default dark;
