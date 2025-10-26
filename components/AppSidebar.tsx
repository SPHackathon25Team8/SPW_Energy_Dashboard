import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from './ui/sidebar';
import { BarChart3, Settings, Zap } from 'lucide-react';
import type { Page } from '../types';
import logo from '../assets/ScottishPower_Logo_2023.png';

interface AppSidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  return (
    <Sidebar className='border-slate-200'>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-center">
          <img src="{logo}" alt="Scottish Power" className="h-12" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Energy Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onPageChange('usage')}
                  isActive={currentPage === 'usage'}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Usage Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onPageChange('devices')}
                  isActive={currentPage === 'devices'}
                >
                  <Zap className="w-4 h-4" />
                  <span>My Devices</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}