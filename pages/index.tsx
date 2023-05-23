import { useRouter } from 'next/router';
import React, { useLayoutEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push('/home');
  }, []);

  return <></>;
}
