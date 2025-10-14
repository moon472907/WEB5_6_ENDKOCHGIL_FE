import Image from 'next/image';
import Link from 'next/link';

interface Props {
  equippedItemImg?: string | null;
}

export default function CharacterSection({ equippedItemImg }: Props) {
  return (
    <section className="flex bg-nuts-floor px-5 items-center justify-end relative h-[120px]">
      <Image
        src={equippedItemImg ?? '/images/nuts-default.png'}
        alt="너츠"
        width={150}
        height={150}
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 z-10"
      />
      <Link href="/shop" className="cursor-pointer">
        <Image src="/images/shop.png" alt="꾸미기" width={42} height={52} />
      </Link>
    </section>
  );
}
