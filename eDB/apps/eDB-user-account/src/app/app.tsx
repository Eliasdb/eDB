'use client';

import * as React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { sampleData } from '../components/lib/sample-data';
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
  const [selectedProject, setSelectedProject] = React.useState<
    (typeof sampleData.projects)[number] | null
  >(sampleData.projects[0]);

  const [token, setToken] = React.useState<string | null>(null);
  const [userInfo, setUserInfo] = React.useState<null | {
    email: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
  }>(null);

  React.useEffect(() => {
    const tokenFromAttr = document
      .querySelector('home-react')
      ?.getAttribute('data-token');
    const tokenFromStorage = sessionStorage.getItem('access_token');
    const resolvedToken = tokenFromAttr || tokenFromStorage;

    setToken(resolvedToken);

    if (resolvedToken) {
      fetch(
        'http://localhost:8080/realms/eDB/protocol/openid-connect/userinfo',
        {
          headers: {
            Authorization: `Bearer ${resolvedToken}`,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setUserInfo({
            email: data.email,
            given_name: data.given_name,
            family_name: data.family_name,
            preferred_username: data.preferred_username,
          });
        })
        .catch((err) => {
          console.error('Failed to fetch user info:', err);
        });
    }
  }, []);

  function renderContent() {
    switch (selectedProject?.name) {
      case 'Personal Info':
        return <PersonalInfoView userInfo={userInfo} />;
      case 'Account Settings':
        return <AccountSettingsView />;
      default:
        return <PlaceholderView title={selectedProject?.name ?? 'Home'} />;
    }
  }

  return (
    <main className="flex h-screen bg-background text-black">
      <SidebarProvider>
        <AppSidebar onSelectProject={setSelectedProject} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mt-[5rem]">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
            {renderContent()}
            <div className="mt-6 p-4 bg-muted rounded border">
              <h3 className="font-semibold mb-2">Token (Debug View)</h3>
              <code className="text-xs break-all whitespace-pre-wrap">
                {token ?? 'No token found'}
              </code>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
