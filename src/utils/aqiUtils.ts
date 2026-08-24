import { AQICategory } from '../types';

export function getAqiCategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getAqiTheme(category: AQICategory) {
  switch (category) {
    case 'Good':
      return {
        hex: '#16a34a',
        bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        barClass: 'bg-emerald-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-500',
        description: 'Minimal health impact; clean ambient air quality.',
      };
    case 'Satisfactory':
      return {
        hex: '#65a30d',
        bgLight: 'bg-lime-50 text-lime-800 border-lime-300',
        badge: 'bg-lime-100 text-lime-800 border-lime-200',
        barClass: 'bg-lime-600',
        textColor: 'text-lime-700',
        borderColor: 'border-lime-500',
        description: 'Minor breathing discomfort to sensitive people.',
      };
    case 'Moderate':
      return {
        hex: '#d97706',
        bgLight: 'bg-amber-50 text-amber-900 border-amber-300',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        barClass: 'bg-amber-500',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-500',
        description: 'Breathing discomfort to people with lung/heart disease.',
      };
    case 'Poor':
      return {
        hex: '#ea580c',
        bgLight: 'bg-orange-50 text-orange-900 border-orange-300',
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        barClass: 'bg-orange-600',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-500',
        description: 'Breathing discomfort to most people on prolonged exposure.',
      };
    case 'Very Poor':
      return {
        hex: '#dc2626',
        bgLight: 'bg-red-50 text-red-900 border-red-300',
        badge: 'bg-red-100 text-red-800 border-red-200',
        barClass: 'bg-red-600',
        textColor: 'text-red-700',
        borderColor: 'border-red-500',
        description: 'Respiratory illness to people on prolonged exposure.',
      };
    case 'Severe':
    default:
      return {
        hex: '#7f1d1d',
        bgLight: 'bg-rose-100 text-rose-950 border-rose-400',
        badge: 'bg-rose-200 text-rose-900 border-rose-300',
        barClass: 'bg-rose-900',
        textColor: 'text-rose-900',
        borderColor: 'border-rose-900',
        description: 'Affects healthy people and seriously impacts those with existing diseases.',
      };
  }
}

export function getFireInfluenceBadge(influence: 'Low' | 'Moderate' | 'High' | 'Severe') {
  switch (influence) {
    case 'Low':
      return { bg: 'bg-forest-100 text-forest-800 border-forest-200', label: 'Low Fire Tracer' };
    case 'Moderate':
      return { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Moderate Influence' };
    case 'High':
      return { bg: 'bg-rust-100 text-rust-800 border-rust-200', label: 'High Plume Influence' };
    case 'Severe':
      return { bg: 'bg-danger-100 text-danger-800 border-danger-200', label: 'Severe Agricultural Burn' };
  }
}
