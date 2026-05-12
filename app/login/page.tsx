import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react'
import { redirect } from 'next/navigation';
import LoginPage from '@/components/LoginPage';
const page = () => {
   const logined = async () =>{
    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (session) {
        redirect("/");
      }
    
  }

 
  return (
    <div>
      <LoginPage/>
    </div>
  )
}

export default page