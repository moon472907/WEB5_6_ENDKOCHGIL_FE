'use client';

import { tw } from '@/lib/tw';

export type Category = 'all' | 'nature' | 'festival' | 'sports' | 'character' | 'special';

const categoryLabels: Record<Category, string> = {
  all: '전체',
  nature: '자연',
  festival: '축제',
  sports: '스포츠',
  character: '캐릭터',
  special: '특별',
};

interface Props {
  category: Category;
  setCategory: (cat: Category) => void;
}

export default function CategoryTabs({ category, setCategory }: Props) {
  return (
    <div className="grid grid-cols-6 gap-2 px-5 h-[56px] items-center bg-bg-main border-b border-border-card-disabled">
      {(Object.keys(categoryLabels) as Category[]).map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={tw(
            'h-10 rounded-xl text-sm font-medium transition-colors cursor-pointer',
            category === cat
              ? 'bg-button-selected text-basic-white'
              : 'bg-basic-white border border-gray-03 text-gray-07'
          )}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
}
