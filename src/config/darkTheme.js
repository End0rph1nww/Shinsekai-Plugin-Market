export const darkThemeOverrides = {
  common: {
    duration: '0.2s',
    borderRadius: '10px',
    primaryColor: '#fb7185',
    primaryColorHover: '#fb8da0',
    primaryColorPressed: '#f43f5e',
    infoColor: '#fb7185',
    successColor: '#34d399',
    warningColor: '#fbbf24',
    errorColor: '#f87171',
    baseColor: '#191125',
    textColor2: '#f7ecff',
    textColor3: '#d7c2df'
  },
  Card: {
    borderRadius: '16px',
    color: 'rgba(35, 24, 52, 0.88)',
    colorModal: 'rgba(35, 24, 52, 0.98)'
  },
  Input: {
    borderHover: '#fb8da0',
    borderFocus: '#fb7185'
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#f7ecff',
        placeholderColor: '#bda7c8',
        color: 'rgba(35, 24, 52, 0.78)',
        colorActive: 'rgba(35, 24, 52, 0.96)',
        border: '1px solid rgba(251, 113, 133, 0.32)',
        borderHover: '1px solid #fb8da0',
        borderActive: '1px solid #fb7185',
        borderFocus: '1px solid #fb7185'
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
