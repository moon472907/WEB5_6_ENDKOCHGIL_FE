'use client';

interface NotificationMenuProps {
  onRead: () => void;
  onDelete: () => void;
}

// 알림 항목 우측의 점 세개 메뉴
export default function NotificationMenu({
  onRead,
  onDelete
}: NotificationMenuProps) {
  return (
    <div className="absolute right-2 top-7 w-[100px] bg-basic-white border border-gray-200 shadow-md rounded-md z-50">
      <button
        onClick={onRead}
        className="w-full text-left text-xs px-3 py-2 rounded-md has-hover:bg-gray-01 active:bg-gray-01 cursor-pointer"
      >
        읽음 처리
      </button>
      <button
        onClick={onDelete}
        className="w-full text-left text-xs px-3 py-2 rounded-md has-hover:bg-gray-01 active:bg-gray-01 text-red-500 cursor-pointer"
      >
        삭제하기
      </button>
    </div>
  );
}
