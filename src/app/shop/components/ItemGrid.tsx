'use client';

import Image from 'next/image';
import { Item } from '../items';

interface Props {
  items: Item[];
  mode: 'shop' | 'closet';
  onItemClick: (item: Item) => void;
}

export default function ItemGrid({ items, mode, onItemClick }: Props) {
  return (
    <div className="grid grid-cols-3 [@media(min-width:431px)]:grid-cols-4 gap-4 px-5 py-4">
      {items.map(item => (
        <button
          type="button"
          key={item.id}
          onClick={() => onItemClick(item)}
          className="flex flex-col items-center cursor-pointer bg-basic-white rounded-xl py-4"
        >
          <Image
            src={item.img}
            alt={item.name}
            width={60}
            height={75}
            className="rounded-md"
          />
          <span className="mt-2 text-sm font-medium break-keep">
            {item.name}
          </span>
          {mode === 'shop' && (
            <span className="text-xs text-gray-500">{item.price} 코인</span>
          )}
        </button>
      ))}
    </div>
  );
}
