import React from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";

// import { useTranslations } from 'next-intl'
export default function webpage({ props }: any) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/ielts");
  }, [router]);

  return null;
}


