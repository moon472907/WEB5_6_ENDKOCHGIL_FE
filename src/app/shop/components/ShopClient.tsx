'use client';

import Header from '@/components/layout/Header';
import Coin from '@/components/ui/Coin';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import TabBar from './TabBar';
import CategoryTabs, { Category } from './CategoryTabs';
import ItemGrid from './ItemGrid';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { HiOutlineRefresh } from 'react-icons/hi';
import { Item } from '@/lib/api/shop/item';

interface Props {
  coin: number; // 서버에서 받은 코인
  initialItems: Item[]; // 서버에서 받은 아이템 리스트
}

export default function ShopClient({ coin, initialItems }: Props) {
  const [tab, setTab] = useState<'shop' | 'closet'>('shop'); // 탭 상태 관리
  const [category, setCategory] = useState<Category>('all'); // 카테고리 상태 관리
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // 선택한 아이템 상태 관리
  const [items, setItems] = useState<Item[]>(initialItems);
  const listRef = useRef<HTMLDivElement | null>(null); // 스크롤 상태 관리

  // 아이템 필터링
  const filteredItems = items.filter(
    item =>
      (tab === 'shop' ? !item.owned : item.owned) &&
      (category === 'all' || item.itemType === category.toUpperCase())
  );

  // 탭 바뀔 때 스크롤, 카테고리 초기화
  useEffect(() => {
    setCategory('all');
    listRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [tab]);

  // 카테고리 바뀔 때 스크롤 초기화
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [category]);

  // 모달 문구
  const confirmLines =
    selectedItem &&
    (tab === 'shop'
      ? [`[${selectedItem.name}]`, '구매하시겠습니까?']
      : [`[${selectedItem.name}]`, '착용하시겠습니까?']);

  // 컨펌 확인 버튼 눌렀을 때 동작
  const handleConfirm = () => {
    if (!selectedItem) return;
    if (tab === 'shop') {
      alert(`구매 완료`);
    } else {
      alert(`착용 완료`);
    }
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden pb-14">
      {/* 헤더 영역 */}
      <div className="relative flex-none">
        <Header title={tab === 'shop' ? '상점' : '옷장'} bgColor="white" />
        <div className="absolute right-4 top-0 h-14 flex items-center z-[60]">
          <Coin coin={coin} />
        </div>
      </div>

      {/* 흰색 영역 */}
      <section className="flex flex-col bg-basic-white py-4 px-5 gap-2 h-[calc(180px-56px)] flex-none"></section>

      {/* 너츠 영역 */}
      <section className="flex bg-nuts-floor px-5 items-center justify-end relative h-[120px] flex-none">
        <Image
          src="/images/nuts-kid.png"
          alt="너츠"
          width={110}
          height={165}
          priority
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 z-10"
        />
        {tab === 'closet' && (
          <button
            type="button"
            className="cursor-pointer rounded-full bg-basic-white h-10 w-10"
          >
            <div className='text-basic-black flex flex-col items-center justify-center'>
              <HiOutlineRefresh size={20} />
            </div>
          </button>
        )}
      </section>

      {/* 아이템 영역 */}
      <section className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-none">
          <CategoryTabs category={category} setCategory={setCategory} />
        </div>
        <div ref={listRef} className="overflow-y-auto scrollbar flex-1">
          <ItemGrid
            items={filteredItems}
            mode={tab}
            onItemClick={setSelectedItem}
          />
        </div>
      </section>

      {/* 하단 탭 */}
      <div className="flex-none">
        <TabBar tab={tab} setTab={setTab} />
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        open={!!selectedItem}
        onConfirm={handleConfirm}
        onCancel={() => setSelectedItem(null)}
        variant="happy"
        lines={confirmLines ?? []}
      />
    </div>
  );
}
