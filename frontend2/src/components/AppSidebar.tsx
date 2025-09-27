import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bookmark, 
  Settings, 
  MessageSquare,
  Hash,
  Facebook,
  Twitter
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

type Platform = 'reddit' | 'discord' | 'twitter' | 'facebook';

interface AppSidebarProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Saved Gigs", url: "/saved", icon: Bookmark },
  { title: "Settings", url: "/settings", icon: Settings },
];

const platforms = [
  { 
    id: 'reddit' as const, 
    name: 'Reddit', 
    icon: MessageSquare, 
    enabled: true,
    color: 'reddit'
  },
  { 
    id: 'discord' as const, 
    name: 'Discord', 
    icon: Hash, 
    enabled: false,
    color: 'discord'
  },
  { 
    id: 'twitter' as const, 
    name: 'Twitter/X', 
    icon: Twitter, 
    enabled: false,
    color: 'twitter'
  },
  { 
    id: 'facebook' as const, 
    name: 'Facebook', 
    icon: Facebook, 
    enabled: false,
    color: 'facebook'
  },
];

export function AppSidebar({ selectedPlatform, onPlatformChange }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="gap-6">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive}
                      className={cn(
                        "group transition-colors",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      )}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="flex w-full items-center"
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Platform Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel>Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platforms.map((platform) => {
                const isSelected = selectedPlatform === platform.id;
                return (
                  <SidebarMenuItem key={platform.id}>
                    <SidebarMenuButton
                      asChild
                      disabled={!platform.enabled}
                      isActive={isSelected}
                      className={cn(
                        "group transition-colors",
                        isSelected && platform.enabled && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                        !platform.enabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <button
                        onClick={() => platform.enabled && onPlatformChange(platform.id)}
                        className="flex w-full items-center justify-between"
                        disabled={!platform.enabled}
                      >
                        <div className="flex items-center">
                          <platform.icon className={cn(
                            "mr-3 h-4 w-4",
                            platform.enabled && isSelected && `text-${platform.color}`
                          )} />
                          <span>{platform.name}</span>
                        </div>
                        {!platform.enabled && (
                          <Badge variant="secondary" className="text-xs">
                            Soon
                          </Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}