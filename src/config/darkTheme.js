export const darkThemeOverrides = {
  common: {
    duration: '0.2s',
    borderRadius: '10px',
    primaryColor: '#a78bfa',
    primaryColorHover: '#c4b5fd',
    primaryColorPressed: '#8b5cf6',
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
    borderHover: '#c4b5fd',
    borderFocus: '#a78bfa'
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#f7ecff',
        placeholderColor: '#bda7c8',
        color: 'rgba(35, 24, 52, 0.78)',
        colorActive: 'rgba(35, 24, 52, 0.96)',
        border: '1px solid rgba(167, 139, 250, 0.32)',
        borderHover: '1px solid #c4b5fd',
        borderActive: '1px solid #a78bfa',
        borderFocus: '1px solid #a78bfa'
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
