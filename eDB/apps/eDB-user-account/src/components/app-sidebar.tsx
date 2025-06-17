import * as React from 'react';
import { sampleData } from '../data/sample-data';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from './ui/sidebar';

export function AppSidebar({
  onSelectProject,
  userInfo,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onSelectProject: (project: any) => void;
  userInfo?: {
    name: string;
    email: string;
    avatar: string;
  } | null;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sampleData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sampleData.navMain} onSelectProject={onSelectProject} />
      </SidebarContent>
      <SidebarFooter>{userInfo && <NavUser user={userInfo} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
