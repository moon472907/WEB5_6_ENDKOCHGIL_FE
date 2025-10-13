'use client';

import { useState } from 'react';
import Loading from '@/components/loading/Loading';
import MissionCreateView from './MissionCreateView';
import AlertModal from '@/components/modal/AlertModal';
import { useRouter } from 'next/navigation';

export default function MissionCreateLoader() {
   const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (loading) {
    return <Loading text="미션을 생성하고 있어요" />;
  }

  return (
    <>
      <MissionCreateView
        setLoading={setLoading}
        onError={(message: string) => {
          setErrorMessage(message);
          setModalOpen(true);
        }}
      />

      <AlertModal
        open={modalOpen}
        onConfirm={() => router.push('/')}
        title="미션 생성 실패"
        detail={errorMessage}
        confirmText="확인"
      />
    </>
  );
}
