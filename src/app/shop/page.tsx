'use client'

import Header from "@/components/layout/Header";
import Coin from "@/components/ui/Coin";
import Image from "next/image";
import { useState } from "react";
import TabBar from "./components/TabBar";

export default function Page() {
  const [tab, setTab] = useState<'shop' | 'closet'>('shop');

  return (

    <div className="flex flex-col min-h-dvh pb-20">

      {/* 헤더 영역 */}
      <div className="relative">
        <Header title="상점" bgColor="white" />
        <div className="absolute right-4 top-0 h-14 flex items-center z-[60]">
          <Coin coin={100} />
        </div>
      </div>

      {/* 흰색 영역 */}
      <section className="flex flex-col bg-basic-white py-4 px-5 gap-2 h-[calc(180px-56px)]"></section>

      {/* 너츠 영역 */}
      <section className="flex bg-nuts-floor px-5 items-center justify-end relative h-[120px]">
        <Image
          src="/images/nuts-kid.png"
          alt="너츠"
          width={110}
          height={165}
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 z-10"
        />
      </section>

      {/* 상점 영역 */}
      <section className="flex flex-col gap-2 px-7 py-4">


      </section>

      {/* 하단 탭 */}
      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}