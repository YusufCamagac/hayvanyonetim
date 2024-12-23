module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
          primary: {
            50: '#e0f2fe',
            100: '#bae6fd',
            200: '#7dd3fc',
            300: '#38bdf8',
            400: '#0ea5e9',
            500: '#EAB508', // Açık mor (linkler ve vurgular için)
            600: '#7E22CE', // Daha koyu mor
            700: '#075985',
            800: '#0c4a6e',
            900: '#0d405d', // Koyu lacivert (başlıklar ve bazı metinler için)
          },
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b', // Açık gri (metin rengi)
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#202124', // Çok koyu lacivert (ana arka plan rengi)
          },
          accent: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#FDF4DC', // Açık sarı veya krem rengi
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
        background: '#18181b', // Ana arka plan rengi
        
        'header-bg': '#28282B', // Header arka plan
        'menu-bg': '#334155', // Menü arka plan 
        'card-bg': '#28282B', // Kart arka plan 
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};