import { tw } from '@/lib/tw';

type PaddingSize = 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  withNav?: boolean;
  children: React.ReactNode;
  padding?: PaddingSize;
};

export default function ContentWrapper({
  withNav,
  children,
  padding = 'sm'
}: Props) {
  const paddingClass = {
    sm: 'p-4', // 16px
    md: 'p-5', // 20px
    lg: 'p-6', // 24px
    xl: 'p-7' // 28px
  }[padding];

  return (
    <main
      className={tw('flex-1', paddingClass, withNav && 'pb-[calc(65px+16px)]')}
    >
      {children}
    </main>
  );
}
