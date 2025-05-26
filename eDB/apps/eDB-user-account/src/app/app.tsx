'use client';

// Hooks
import { useEffect, useState } from 'react';

// Components
import { AppSidebar } from '../components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import { Separator } from '../components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar';

// Views
import {
  AccountSecurityView,
  ApplicationsView,
  PersonalInfoView,
  PlaceholderView,
} from '../views';

// Data
import { breadcrumbLabels, sampleData } from '../data/sample-data';

// DAL
import { fetchCustomAttributes, getToken } from '../services/user-service';

// Query Hook
import { useUserInfoQuery } from '../hooks/useUserInfoQuery';

// Types
import { UserInfo } from '../types/types';

// External libs

export default function App() {
  const [selectedNavItem, setSelectedNavItem] = useState(sampleData.navMain[0]);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  const { data, isLoading, isError } = useUserInfoQuery(token);

  useEffect(() => {
    if (!data) return;
    fetchCustomAttributes(token!)
      .then((custom) => {
        const merged = {
          ...data,
          attributes: custom.attributes ?? {},
        };
        console.log('✅ merged userInfo:', merged);
        setUserInfo(merged);
      })
      .catch((err) => {
        console.error('Failed to fetch custom attributes:', err);
      });
  }, [data, token]);

  function renderContent() {
    if (isLoading) return <div className="p-6">Loading...</div>;
    if (isError || !userInfo)
      return <div className="p-6 text-red-500">Failed to load user info.</div>;

    switch (selectedNavItem?.title) {
      case 'Personal Info':
        return <PersonalInfoView userInfo={userInfo} />;
      case 'Account Security':
        return <AccountSecurityView token={token} />;
      case 'Applications':
        return <ApplicationsView />;
      default:
        return <PlaceholderView title={selectedNavItem?.title ?? 'Home'} />;
    }
  }

  return (
    <main className="flex h-screen bg-background text-black">
      <SidebarProvider>
        <AppSidebar
          onSelectProject={setSelectedNavItem}
          userInfo={
            userInfo && {
              name: userInfo.preferred_username,
              email: userInfo.email,
              avatar:
                'https://s3.eu-central-1.amazonaws.com/uploads.mangoweb.org/shared-prod/visegradfund.org/uploads/2021/08/placeholder-male.jpg',
            }
          }
        />
        <SidebarInset>
          <header className="flex h-16 fixed shrink-0 items-center gap-2 border-b px-6 mt-[5rem] w-full bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>Account</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <span className="font-medium">
                      {breadcrumbLabels[selectedNavItem?.title ?? ''] ??
                        'Overview'}
                    </span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-6 overflow-y-auto py-[10rem] ">
            {renderContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
