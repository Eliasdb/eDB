'use client';

// ---------------------------------------------------------------------------
// App.tsx — skeleton‑first loading strategy (no fullscreen spinner)
// ---------------------------------------------------------------------------
// • The global layout renders immediately.
// • Sidebar + header show skeletons until we know the user.
// • Content view receives `userInfo` (possibly undefined) and shows its own
//   field‑level skeletons — no flash of error, no blocking spinner.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';

// Components ---------------------------------------------------------------
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
import { Skeleton } from '../components/ui/skeleton';

// Views -------------------------------------------------------------------
import {
  AccountSecurityView,
  ApplicationsView,
  PersonalInfoView,
  PlaceholderView,
} from '../views';

// Data --------------------------------------------------------------------
import { breadcrumbLabels, sampleData } from '../data/sample-data';

// DAL ---------------------------------------------------------------------
import { fetchCustomAttributes, getToken } from '../services/user-service';

// Query Hook ---------------------------------------------------------------
import { useUserInfoQuery } from '../hooks/useUserInfoQuery';

// Types -------------------------------------------------------------------
import type { NavItem, UserInfo } from '../types/types';

export default function App() {
  // ─────────────────────────────────── State ──────────────────────────────
  const [selectedNavItem, setSelectedNavItem] = useState<NavItem>(
    sampleData.navMain[0],
  );
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // ─────────────────────────────────── Token ──────────────────────────────
  useEffect(() => {
    getToken().then(setToken).catch(console.error);
  }, []);

  // ────────────────────────── Keycloak profile query ─────────────────────
  const {
    data: kcProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserInfoQuery(token); // hook internally uses `enabled: !!token`

  // ─────────────────────────── Custom attributes ─────────────────────────
  useEffect(() => {
    if (!kcProfile || !token) return;

    (async () => {
      try {
        const custom = await fetchCustomAttributes(token);
        setUserInfo({
          ...kcProfile,
          attributes: custom.attributes ?? {},
        });
      } catch (err) {
        console.error('Failed to fetch custom attributes:', err);
      }
    })();
  }, [kcProfile, token]);

  // ───────────────────────────── Derived flags ───────────────────────────
  /** true until we know whether profile fetch succeeded/failed */
  const isBootstrapping =
    !token || isProfileLoading || (!kcProfile && !isProfileError);

  /** Show skeleton sidebar/header while bootstrapping */
  const showShellSkeleton = isBootstrapping;

  // ───────────────────────────── Render helpers ───────────────────────────
  const renderContent = () => {
    if (isProfileError) {
      return <div className="p-6 text-red-500">Failed to load user info.</div>;
    }

    // Render the chosen view *even while userInfo is still null* — each view
    // decides how to skeletonise its own fields.
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
  };

  // ───────────────────────────────────── UI ───────────────────────────────
  return (
    <main className="flex h-screen bg-slate-50 text-black">
      <SidebarProvider>
        <AppSidebar
          onSelectProject={setSelectedNavItem}
          userInfo={{
            name: userInfo?.preferred_username ?? '',
            email: userInfo?.email ?? '',
            avatar:
              'https://s3.eu-central-1.amazonaws.com/uploads.mangoweb.org/shared-prod/visegradfund.org/uploads/2021/08/placeholder-male.jpg',
          }}
        />

        <SidebarInset>
          <header className="fixed flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6 w-full mt-[5rem]">
            {showShellSkeleton ? (
              <Skeleton className="h-8 w-8 rounded-md" />
            ) : (
              <SidebarTrigger className="-ml-1" />
            )}
            <Separator orientation="vertical" className="mx-2 h-4" />
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

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 py-[10rem]">
            {renderContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
