import ContentWrapper from "@/components/layout/ContentWrapper";
import Header from "@/components/layout/Header";
import { mockNotices } from "./notices";
import NoticeToggleCard from "@/components/ui/NoticeToggleCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항 - NuTree",
  description: "NuTree의 새로운 소식과 안내를 확인해보세요."
};

export default function Page() {
  return (
    <>
      <Header title="공지사항" />
      <ContentWrapper withNav padding="xl">
        <div className="space-y-[10px]">
          {[...mockNotices].reverse().map((notice, idx) => (
            <NoticeToggleCard
              key={notice.id}
              title={notice.title}
              content={notice.content}
              date={notice.date}
              defaultOpen={idx === 0} // 첫 번째만 열기
            />
          ))}
        </div>
      </ContentWrapper>
    </>
  );
}
