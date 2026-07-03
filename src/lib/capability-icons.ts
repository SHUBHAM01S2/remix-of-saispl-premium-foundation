import {
  Globe,
  Cpu,
  LayoutDashboard,
  PenTool,
  Zap,
  Rocket,
  Shield,
  Database,
  Sparkles,
  Code,
  Bot,
  Cloud,
  Server,
  Layers,
  LineChart,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const CAPABILITY_ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Cpu,
  LayoutDashboard,
  PenTool,
  Zap,
  Rocket,
  Shield,
  Database,
  Sparkles,
  Code,
  Bot,
  Cloud,
  Server,
  Layers,
  LineChart,
  Smartphone,
};

export function iconForCapability(name: string | null | undefined): LucideIcon {
  if (name && CAPABILITY_ICON_MAP[name]) return CAPABILITY_ICON_MAP[name];
  return Globe;
}
