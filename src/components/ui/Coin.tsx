import Image from 'next/image';

interface CoinProps {
  coin: number;
}

function Coin({ coin }: CoinProps) {
  return (
    <div className='inline-flex gap-1 font-semibold items-center border-2 border-border-coin rounded-xl px-2.5 py-1.5 h-8'>
      <Image src="/images/coin.png" alt="코인" width={20} height={20} className="w-5 h-5"/>
      <span className='text-gray-07'>{coin}</span>
    </div>
  );
}
export default Coin;
