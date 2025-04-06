import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				travel: {
					primary: '#0EA5E9',
					secondary: '#2563EB',
					accent: '#F97316',
					light: '#E5DEFF',
					dark: '#1A1F2C',
				}
			}
		}
	},
	plugins: []
} satisfies Config;
