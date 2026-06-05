export const lightThemeOverrides = {
  common: {
    duration: '0.2s',
    borderRadius: '10px',
    primaryColor: '#e8789a',
    primaryColorHover: '#ef8fad',
    primaryColorPressed: '#d85b84',
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
    borderHover: '#ef8fad',
    borderFocus: '#e8789a'
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#351f4e',
        placeholderColor: '#8b728f',
        color: 'rgba(255, 255, 255, 0.78)',
        colorActive: 'rgba(255, 255, 255, 0.94)',
        border: '1px solid rgba(232, 120, 154, 0.24)',
        borderHover: '1px solid #ef8fad',
        borderActive: '1px solid #e8789a',
        borderFocus: '1px solid #e8789a'
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
