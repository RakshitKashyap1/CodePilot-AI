import {
  LayoutDashboard,
  Code2,
  History,
  Settings,
  Shield,
  CreditCard,
  User,
} from "lucide-react";
import { Github } from "@/components/shared/icons";

export const DASHBOARD_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Review Workspace",
    href: "/workspace",
    icon: Code2,
  },
  {
    title: "Review History",
    href: "/history",
    icon: History,
  },
  {
    title: "GitHub Integration",
    href: "/github",
    icon: Github,
  },
];

export const SETTINGS_NAV_ITEMS = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: Shield,
  },
  {
    title: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
