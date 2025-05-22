// App.tsx
'use client';

import * as React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { sampleData } from '../components/lib/sample-data';
import {
  fetchUserInfo,
  getToken,
  type UserInfo,
} from '../components/lib/user-service';
import { Separator } from '../components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar';
import { AccountSettingsView } from '../components/views/account-settings-view';
import { PersonalInfoView } from '../components/views/personal-info-view';
import { PlaceholderView } from '../components/views/placeholder-view';

export default function App() {
  const [selectedProject, setSelectedProject] = React.useState(
    sampleData.projects[0],
  );
  const [token, setToken] = React.useState<string | null>(null);
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);

  React.useEffect(() => {
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
    switch (selectedProject?.name) {
      case 'Personal Info':
        return <PersonalInfoView userInfo={userInfo} />;
      case 'Account Security':
        return <AccountSettingsView />;
      default:
        return <PlaceholderView title={selectedProject?.name ?? 'Home'} />;
    }
  }

  return (
    <main className="flex h-screen bg-background text-black">
      <SidebarProvider>
        <AppSidebar
          onSelectProject={setSelectedProject}
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 mt-[5rem]">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
