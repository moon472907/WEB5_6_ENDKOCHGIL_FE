'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeDefaultIcon,
  HomeSelectedIcon,
  RecruitDefaultIcon,
  RecruitSelectedIcon,
  ProgressDefaultIcon,
  ProgressSelectedIcon,
  SettingsDefaultIcon,
  SettingsSelectedIcon
} from './icons';
import { tw } from '@/lib/tw';

function Nav() {
  const pathname = usePathname();

  const items = [
    {
      to: '/',
      label: '홈',
      defaultIcon: HomeDefaultIcon,
      selectedIcon: HomeSelectedIcon
    },
    {
      to: '#',
      label: '모집',
      defaultIcon: RecruitDefaultIcon,
      selectedIcon: RecruitSelectedIcon
    },
    {
      to: '#',
      label: '진행도',
      defaultIcon: ProgressDefaultIcon,
      selectedIcon: ProgressSelectedIcon
    },
    {
      to: '/settings',
      label: '설정',
      defaultIcon: SettingsDefaultIcon,
      selectedIcon: SettingsSelectedIcon
    }
  ];

  return (
    <nav
      aria-label="하단 내비게이션"
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[600px] h-[65px] border-t border-t-[#F5F5F5] bg-basic-white box-border"
    >
      <ul className="flex items-center h-full">
        {items.map(
          ({
            to,
            label,
            defaultIcon: DefaultIcon,
            selectedIcon: SelectedIcon
          }) => {
            const isActive = pathname === to || pathname.startsWith(to + '/');

            return (
              <li key={label} className="flex-1">
                <Link
                  href={to}
                  aria-label={label}
                  className={tw(
                    'flex flex-col items-center transition-colors duration-100',
                    isActive
                      ? 'text-button-point font-bold'
                      : 'text-border-card-disabled'
                  )}
                >
                  {isActive ? (
                    <SelectedIcon className="w-8 h-8" aria-hidden="true" />
                  ) : (
                    <DefaultIcon className="w-8 h-8" aria-hidden="true" />
                  )}
                  <span className="text-sm leading-4">{label}</span>
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </nav>
  );
}
export default Nav;
