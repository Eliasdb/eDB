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
import { fetchUserInfo, getToken } from '../services/user-service';

// Types
import { UserInfo } from '../types/types';

export default function App() {
  const [selectedNavItem, setSelectedNavItem] = useState(sampleData.navMain[0]);

  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    getToken().then((resolvedToken) => {
      if (!resolvedToken) return;
      setToken(resolvedToken);

      fetchUserInfo(resolvedToken)
        .then((data) => {
          if (data) setUserInfo(data);
        })
        .catch((err) => console.error('Failed to fetch user info:', err));
    });
  }, []);

  function renderContent() {
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
                'https://s3.eu-central-1.amazonaws.com/uploads.mangoweb.org/shared-prod/visegradfund.org/uploads/2021/08/placeholder-male.jpg', // You can adjust this or use a real avatar
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
