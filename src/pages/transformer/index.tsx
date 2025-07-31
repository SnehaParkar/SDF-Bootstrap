import React from 'react'
import Head from 'next/head'
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';

// import { useTranslations } from 'next-intl'
export default function webpage({ props }: any) {
  return (
    <>
      <div className="sb-container">
        <div className="sb-layout-frame">
          <Header />
          <MainContent />
        </div>
      </div>
    </>
  )
}


