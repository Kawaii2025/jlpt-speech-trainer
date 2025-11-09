/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // 主色调-蓝色
        secondary: '#F97316', // 辅助色-橙色
        success: '#10B981', // 成功-绿色
        error: '#EF4444', // 错误-红色
        accent: '#8B5CF6', // 强调色-紫色
        particle: '#06B6D4', // 助词按钮主色（青色）- 与其他按钮明显区分
        particleLight: '#22D3EE', // 助词按钮高亮色
        shortPlay: '#EC4899', // 短播放按钮主色（粉色）- 全新颜色
        shortPlayLight: '#F472B6', // 短播放按钮高亮色
        male: '#2563EB',
        female: '#DB2777',
        neutral: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        japanese: ['"Noto Sans JP"', 'sans-serif']
      },
      ringColor: {
        DEFAULT: 'rgba(59, 130, 246, 0.5)', // Default ring color for focus states
      },
      ringOffsetWidth: {
        DEFAULT: '0px',
      },
    }
  },
  plugins: [],
}

