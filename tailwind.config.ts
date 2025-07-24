import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				physics: {
					blue: 'hsl(var(--physics-blue))',
					green: 'hsl(var(--physics-green))',
					orange: 'hsl(var(--physics-orange))',
					purple: 'hsl(var(--physics-purple))',
					red: 'hsl(var(--physics-red))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Spring-themed animations
				'spring-bounce': {
					'0%': { transform: 'scale(1) translateX(0)' },
					'25%': { transform: 'scale(1.05) translateX(-2px)' },
					'50%': { transform: 'scale(1.1) translateX(0)' },
					'75%': { transform: 'scale(1.05) translateX(2px)' },
					'100%': { transform: 'scale(1) translateX(0)' }
				},
				'oscillate': {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(4px)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 0 0 hsl(var(--physics-blue) / 0.4)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 0 8px hsl(var(--physics-blue) / 0)',
						transform: 'scale(1.02)'
					}
				},
				'slide-in-spring': {
					'0%': { 
						transform: 'translateX(-100%) scale(0.8)',
						opacity: '0'
					},
					'60%': { 
						transform: 'translateX(10%) scale(1.05)',
						opacity: '0.8'
					},
					'100%': { 
						transform: 'translateX(0) scale(1)',
						opacity: '1'
					}
				},
				'physics-float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-6px) rotate(1deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spring-bounce': 'spring-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'oscillate': 'oscillate 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'slide-in-spring': 'slide-in-spring 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'physics-float': 'physics-float 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
