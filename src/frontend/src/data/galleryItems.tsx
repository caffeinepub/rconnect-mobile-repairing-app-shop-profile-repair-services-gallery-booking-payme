import { Smartphone, Battery, Droplet, Wrench, Shield, Zap } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image?: string;
  icon?: React.ReactNode;
  badge?: string;
  details?: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'screen-repair-1',
    title: 'iPhone Screen Replacement',
    description: 'Complete screen replacement with original quality display',
    fullDescription: 'Professional iPhone screen replacement service using high-quality OLED display. The repair includes complete testing of touch sensitivity, display colors, and brightness levels to ensure perfect functionality.',
    icon: <Smartphone className="w-16 h-16 text-amber-600" />,
    badge: 'Popular',
    details: [
      'Original quality OLED display',
      'Touch sensitivity tested',
      'Color accuracy verified',
      'Completed in 1-2 hours',
    ],
  },
  {
    id: 'battery-replacement-1',
    title: 'Battery Replacement Service',
    description: 'High-capacity battery replacement for extended life',
    fullDescription: 'Replace your old battery with a genuine high-capacity battery. Our service includes battery health diagnostics, proper installation, and calibration for optimal performance.',
    icon: <Battery className="w-16 h-16 text-orange-600" />,
    badge: 'Fast Service',
    details: [
      'Genuine battery parts',
      'Health diagnostics included',
      'Proper calibration',
      'Warranty included',
    ],
  },
  {
    id: 'water-damage-1',
    title: 'Water Damage Recovery',
    description: 'Expert water damage repair and component cleaning',
    fullDescription: 'Comprehensive water damage repair service including complete disassembly, professional cleaning of all components, corrosion treatment, and thorough testing before reassembly.',
    icon: <Droplet className="w-16 h-16 text-blue-600" />,
    details: [
      'Complete disassembly and cleaning',
      'Corrosion treatment',
      'Component testing',
      'Data recovery attempt',
    ],
  },
  {
    id: 'charging-port-1',
    title: 'Charging Port Repair',
    description: 'Fix loose or damaged charging ports',
    fullDescription: 'Professional charging port repair or replacement service. We fix loose connections, damaged pins, and ensure proper charging functionality with thorough testing.',
    icon: <Zap className="w-16 h-16 text-amber-600" />,
    badge: 'Quick Fix',
    details: [
      'Port cleaning or replacement',
      'Connection testing',
      'Fast charging verified',
      'Same-day service available',
    ],
  },
  {
    id: 'back-panel-1',
    title: 'Back Panel Replacement',
    description: 'Replace cracked or damaged back glass',
    fullDescription: 'Replace your damaged back panel with a high-quality replacement. Service includes careful removal of old panel, cleaning, and precise installation of new panel.',
    icon: <Shield className="w-16 h-16 text-orange-600" />,
    details: [
      'Quality replacement parts',
      'Precise installation',
      'Color matched',
      'Protective coating applied',
    ],
  },
  {
    id: 'general-repair-1',
    title: 'General Repairs',
    description: 'Various repair services for all issues',
    fullDescription: 'We handle all types of mobile repairs including camera issues, speaker problems, button repairs, and more. Our expert technicians diagnose and fix any problem efficiently.',
    icon: <Wrench className="w-16 h-16 text-amber-600" />,
    details: [
      'Camera repairs',
      'Speaker & microphone',
      'Button replacements',
      'Software troubleshooting',
    ],
  },
  {
    id: 'screen-repair-2',
    title: 'Samsung Display Repair',
    description: 'AMOLED screen replacement for Samsung devices',
    fullDescription: 'Premium AMOLED display replacement for Samsung devices with original quality parts and professional installation.',
    icon: <Smartphone className="w-16 h-16 text-orange-600" />,
    details: [
      'AMOLED display technology',
      'Perfect color reproduction',
      'Touch response tested',
      'Quality guaranteed',
    ],
  },
  {
    id: 'software-1',
    title: 'Software Services',
    description: 'OS updates, virus removal, and data recovery',
    fullDescription: 'Complete software services including OS updates, virus and malware removal, data recovery, and device optimization for better performance.',
    icon: <Shield className="w-16 h-16 text-blue-600" />,
    badge: 'Expert Service',
    details: [
      'Safe OS updates',
      'Virus removal',
      'Data recovery',
      'Performance optimization',
    ],
  },
];
