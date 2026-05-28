import {
  Palette,
  Smartphone,
  Shield,
  Zap,
  Store,
  CreditCard,
  Layers,
  ShieldCheck,
  User,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Code,
  TrendingUp,
  Gift,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Smartphone,
  Shield,
  Zap,
  Store,
  CreditCard,
  Layers,
  ShieldCheck,
  User,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Code,
  TrendingUp,
  Gift,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export default function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = iconMap[name] || Zap;
  return <Icon className={className} />;
}
