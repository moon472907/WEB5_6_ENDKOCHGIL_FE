import { tw } from '@/lib/tw';

type Props = {
  withNav?: boolean;
  children: React.ReactNode;
};

export default function ContentWrapper({ withNav, children }: Props) {
  return (
    <main className={tw('flex-1 p-4', withNav && 'pb-[calc(65px+16px)]')}>
      {children}
    </main>
  );
}
