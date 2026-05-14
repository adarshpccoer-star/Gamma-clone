"use client"

import React, { useEffect } from 'react'

import LoginPage from '@/components/LoginPage';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter();
 const { data: session, isPending } = authClient.useSession();
 
   useEffect(() => {
  if (!isPending && session) {
    router.push("/"); // or wherever your home is
  }
}, [session, isPending, router]);
  return (
    <div>
      <LoginPage/>
    </div>
  )
}

export default page