import { Smartphone, Battery, Zap, Code, Droplet, Wrench } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedTime?: string;
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  services: Service[];
}

export const SERVICES_CATALOG: ServiceCategory[] = [
  {
    id: 'screen-display',
    name: 'Screen & Display',
    icon: <Smartphone className="w-5 h-5" />,
    services: [
      {
        id: 'screen-replacement',
        name: 'Screen Replacement',
        description: 'Complete LCD/OLED screen replacement with original quality parts',
        estimatedTime: '1-2 hours',
        popular: true,
      },
      {
        id: 'glass-replacement',
        name: 'Glass Replacement',
        description: 'Front glass replacement for cracked screens',
        estimatedTime: '1 hour',
      },
      {
        id: 'touch-repair',
        name: 'Touch Screen Repair',
        description: 'Fix unresponsive or partially working touch screens',
        estimatedTime: '1-2 hours',
      },
      {
        id: 'display-issues',
        name: 'Display Issues',
        description: 'Fix display problems like lines, spots, or color issues',
        estimatedTime: '1-2 hours',
      },
    ],
  },
  {
    id: 'battery',
    name: 'Battery Services',
    icon: <Battery className="w-5 h-5" />,
    services: [
      {
        id: 'battery-replacement',
        name: 'Battery Replacement',
        description: 'Replace old or damaged battery with genuine parts',
        estimatedTime: '30-45 minutes',
        popular: true,
      },
      {
        id: 'battery-health',
        name: 'Battery Health Check',
        description: 'Complete battery diagnostics and health assessment',
        estimatedTime: '15 minutes',
      },
      {
        id: 'charging-issues',
        name: 'Charging Problems',
        description: 'Fix slow charging or battery drain issues',
        estimatedTime: '1 hour',
      },
    ],
  },
  {
    id: 'charging',
    name: 'Charging & Ports',
    icon: <Zap className="w-5 h-5" />,
    services: [
      {
        id: 'charging-port',
        name: 'Charging Port Repair',
        description: 'Fix or replace damaged charging ports',
        estimatedTime: '1 hour',
        popular: true,
      },
      {
        id: 'charging-ic',
        name: 'Charging IC Replacement',
        description: 'Replace faulty charging IC for proper charging',
        estimatedTime: '2-3 hours',
      },
      {
        id: 'cable-connector',
        name: 'Cable & Connector Issues',
        description: 'Fix loose or damaged charging connectors',
        estimatedTime: '45 minutes',
      },
    ],
  },
  {
    id: 'software',
    name: 'Software Services',
    icon: <Code className="w-5 h-5" />,
    services: [
      {
        id: 'software-update',
        name: 'Software Update',
        description: 'Update to latest OS version safely',
        estimatedTime: '30-60 minutes',
      },
      {
        id: 'virus-removal',
        name: 'Virus & Malware Removal',
        description: 'Remove viruses, malware, and unwanted apps',
        estimatedTime: '1 hour',
      },
      {
        id: 'data-recovery',
        name: 'Data Recovery',
        description: 'Recover lost or deleted data from your device',
        estimatedTime: '2-4 hours',
      },
      {
        id: 'factory-reset',
        name: 'Factory Reset & Setup',
        description: 'Complete device reset and fresh setup',
        estimatedTime: '30 minutes',
      },
    ],
  },
  {
    id: 'water-damage',
    name: 'Water Damage',
    icon: <Droplet className="w-5 h-5" />,
    services: [
      {
        id: 'water-damage-repair',
        name: 'Water Damage Repair',
        description: 'Complete water damage assessment and repair',
        estimatedTime: '2-4 hours',
        popular: true,
      },
      {
        id: 'liquid-cleaning',
        name: 'Liquid Cleaning',
        description: 'Professional cleaning of liquid-damaged components',
        estimatedTime: '1-2 hours',
      },
      {
        id: 'corrosion-treatment',
        name: 'Corrosion Treatment',
        description: 'Remove corrosion from water-damaged parts',
        estimatedTime: '2-3 hours',
      },
    ],
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: <Wrench className="w-5 h-5" />,
    services: [
      {
        id: 'camera-repair',
        name: 'Camera Repair',
        description: 'Fix front or back camera issues',
        estimatedTime: '1-2 hours',
      },
      {
        id: 'speaker-mic',
        name: 'Speaker & Microphone',
        description: 'Repair or replace speakers and microphones',
        estimatedTime: '1 hour',
      },
      {
        id: 'button-repair',
        name: 'Button Repair',
        description: 'Fix power, volume, or home button issues',
        estimatedTime: '1 hour',
      },
      {
        id: 'back-panel',
        name: 'Back Panel Replacement',
        description: 'Replace cracked or damaged back panel',
        estimatedTime: '1 hour',
      },
    ],
  },
];
