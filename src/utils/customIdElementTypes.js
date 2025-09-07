export const CUSTOM_ID_ELEMENT_TYPES = {
  FIXED_TEXT: { label: 'Fixed Text', icon: '📝', hasValue: true },
  RANDOM_20: { label: '20-bit Random', icon: '🎲', formatOptions: ['leadingZeros'] },
  RANDOM_32: { label: '32-bit Random', icon: '🎲', formatOptions: ['leadingZeros'] },
  RANDOM_6: { label: '6-digit Random', icon: '🔢', formatOptions: ['leadingZeros'] },
  GUID: { label: 'GUID', icon: '🆔' },
  DATETIME: { label: 'Date/Time', icon: '📅', formatOptions: ['dateFormat'] },
  SEQUENCE: { label: 'Sequence Number', icon: '🔀', formatOptions: ['leadingZeros'] }
};