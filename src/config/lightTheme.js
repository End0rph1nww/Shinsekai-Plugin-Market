export const lightThemeOverrides = {
  common: {
    duration: '0.2s',
    borderRadius: '10px',
    primaryColor: '#6f55f2',
    primaryColorHover: '#8b72ff',
    primaryColorPressed: '#5740d7',
    infoColor: '#e8789a',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    baseColor: '#fffafd',
    textColor2: '#351f4e',
    textColor3: '#745f7c'
  },
  Card: {
    borderRadius: '16px',
    color: 'rgba(255, 251, 255, 0.86)',
    colorModal: 'rgba(255, 251, 255, 0.98)'
  },
  Input: {
    borderHover: '#8b72ff',
    borderFocus: '#6f55f2'
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#351f4e',
        placeholderColor: '#8b728f',
        color: 'rgba(255, 255, 255, 0.78)',
        colorActive: 'rgba(255, 255, 255, 0.94)',
        border: '1px solid rgba(111, 85, 242, 0.24)',
        borderHover: '1px solid #8b72ff',
        borderActive: '1px solid #6f55f2',
        borderFocus: '1px solid #6f55f2'
      }
    }
  },
  Button: {
    borderRadius: '10px',
    textColorPrimary: '#ffffff',
    textColorHoverPrimary: '#ffffff'
  },
  Tag: {
    borderRadius: '8px'
  }
}
