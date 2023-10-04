"use client";

import React from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
    Home,
    Package,
    LayoutList,
    ShoppingBag,
    Settings,
    LogOut
} from "lucide-react";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import UserProfile from '@/components/userProfile';

export default function SideNavBar() {
    const inactiveLink = 'flex';
    const activeLink = inactiveLink + ' bg-white text-black rounded-sm';
    const inactiveIcon = 'w-6 h-6';
    const activeIcon = inactiveIcon + ' stroke-black';

    const pathname = usePathname();

    return (
        <NavigationMenu>
            <div>
                <div className='flex flex-col font-black text-xl items-center'>
                    <p>SHOP.CO Admin</p>
                </div>
                <UserProfile />
            </div>
            <div className='flex flex-col justify-between h-screen'>
                < NavigationMenuList>
                    <NavigationMenuItem className={pathname === '/' ? activeLink : inactiveLink}>
                        <Home className={pathname === '/' ? activeIcon : inactiveIcon} />
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Dashboard
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={pathname?.includes('/products') ? activeLink : inactiveLink}>
                        <Package className={pathname === '/products' ? activeIcon : inactiveIcon} />
                        <Link href="/protected/products" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Products
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={pathname?.includes('/categories') ? activeLink : inactiveLink}>
                        <LayoutList className={pathname === '/categories' ? activeIcon : inactiveIcon} />
                        <Link href="/protected/categories" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Categories
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={pathname?.includes('/orders') ? activeLink : inactiveLink}>
                        <ShoppingBag className={pathname === '/orders' ? activeIcon : inactiveIcon} />
                        <Link href="/protected/orders" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Orders
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    {/* <NavigationMenuItem className={pathname?.includes('/settings') ? activeLink : inactiveLink}>
                        <Settings className={pathname === '/settings' ? activeIcon : inactiveIcon} />
                        <Link href="/protected/settings" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Settings
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem> */}
                </NavigationMenuList >

                {/* <div className='flex flex-row gap-2 px-5 font-semibold hover:underline'>
                    <LogOut className={inactiveIcon} />
                    <button onClick={() => signOut()}>
                        Sign out
                    </button>
                </div> */}
            </div>
        </NavigationMenu >
    )
}