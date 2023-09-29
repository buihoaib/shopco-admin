"use client";

import React from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import SigninButton from './signinButton';
import { UserCircle } from 'lucide-react';

export default function UserProfile() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="flex gap-1 justify-center">
                <SigninButton />
                <span>as admin</span>
            </div>
        )
    }

    return (
        <div className="flex flex-row gap-3 justify-center">
            <UserCircle className='w-6 h-6' />
            <h2>
                Hello, <b>{session?.user?.name}</b>
            </h2>
        </div>
    )

}