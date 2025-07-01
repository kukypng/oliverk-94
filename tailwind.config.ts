import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
  darkMode: ["class"],
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
      // New color palette based on the provided images
      colors: {
        // Custom brand colors
        'brand-dark': '#0a1211',      // Deep dark green from image
        'brand-gray': '#252425',      // Warm dark gray from image  
        'brand-green': '#8ce2aa',     // Vibrant green from second image
        'brand-orange': '#ff7121',    // Vibrant orange accent
        'brand-cream': '#fffbef',     // Warm white/cream

        // Updated shadcn color system
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
      // Enhanced box shadows with new color palette
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        strong: 'var(--shadow-strong)',
        'brand-glow': '0 0 20px rgba(140, 226, 170, 0.3)',
        'orange-glow': '0 0 20px rgba(255, 113, 33, 0.3)',
      },
      // Enhanced gradients
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0a1211 0%, #252425 100%)',
        'green-gradient': 'linear-gradient(135deg, #8ce2aa 0%, #6bc48b 100%)',
        'orange-gradient': 'linear-gradient(135deg, #ff7121 0%, #e85a0f 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 251, 239, 0.1) 0%, rgba(140, 226, 170, 0.1) 100%)',
      },
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
        '2xl': 'calc(var(--radius) + 4px)',
        '3xl': 'calc(var(--radius) + 8px)',
			},
			keyframes: {
        // ... keep existing code (all existing keyframes)
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
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(8px)'
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.98)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'scale-out': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(0.98)',
            opacity: '0'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(16px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'slide-down': {
          '0%': {
            transform: 'translateY(-16px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'bounce-in': {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.02)'
          },
          '70%': {
            transform: 'scale(0.98)'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'pulse-scale': {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '50%': {
            transform: 'scale(1.02)'
          }
        },
        'glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(140, 226, 170, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(140, 226, 170, 0.8)'
          }
        }
			},
			animation: {
        // ... keep existing code (all existing animations) 
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
        'scale-out': 'scale-out 0.15s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'bounce-in': 'bounce-in 0.4s ease-out',
        'pulse-scale': 'pulse-scale 1.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
