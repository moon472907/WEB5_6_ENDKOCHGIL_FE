import Image from 'next/image';

interface LoadingProps {
  text: string;
}

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-2 h-screen w-full gap-5">
      <div className="relative w-32 h-32">
        <Image
          src="/images/happy-nuts.png"
          alt="로딩"
          fill
          className="object-cover rounded-full"
        />
      </div>

      <p className="text-xl font-semibold text-button-point">{text}</p>
    </div>
  );
}
