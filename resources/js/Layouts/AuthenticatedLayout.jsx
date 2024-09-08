import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { IconBell, IconMessage, IconNotification } from '@tabler/icons-react';
import ChatBox from '@/Components/ChatBox/ChatBox';
import NotificationBox from '@/Components/Notification/NotificationBox';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className=" min-h-screen bg-gray-100 dark:bg-zinc-950">

            <nav className="sticky top-0 bg-gray-100/50 dark:bg-zinc-950/85 dark:border-gray-700 z-50 backdrop-blur-lg ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex md:grid grid-cols-3 justify-between h-14">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>


                        </div>

                        <div className="justify-center hidden sm:-my-px sm:ms-10 sm:flex me-8 h-full space-x-8">
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Home
                            </NavLink>
                            <NavLink href={route('orders.index')} active={route().current('orders.index')}>
                                Order
                            </NavLink>
                            <NavLink href={route('designer.index')} active={route().current('designer.index')}>
                                3D Designer
                            </NavLink>
                        </div>
                        <div className=" justify-end hidden sm:flex sm:items-center sm:ms-6">


                            <div className="ms-3 relative">


                                {user ? (
                                    <div className="flex gap-2 items-center text-gray-500">
                                        <Link href={route('chat')}>
                                            <IconMessage />
                                        </Link>
                                        <NotificationBox user_id={user.id} />
                                        <Dropdown className=''>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 dark:bg-transparent hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        {user.name}

                                                        <svg
                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content className='rounded-none'>
                                                <Dropdown.Link href={route('profile.index')}>Profile</Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>

                            <DarkModeToggle />
                        </div>

                        <div className="justify-end -me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('orders.index')} active={route().current('orders.index')}>
                            Order
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('designer.index')} active={route().current('designer.index')}>
                            3D Designer
                        </ResponsiveNavLink>
                        {/* <ResponsiveNavLink href={route('show.products')} active={route().current('show.products')}>
                            Order
                        </ResponsiveNavLink> */}
                        {/* <ResponsiveNavLink href={route('show.products')} active={route().current('show.products')}>
                            Customer Service
                        </ResponsiveNavLink> */}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="font-medium text-base text-gray-800 dark:text-gray-200">{user.name}</div>
                                    <div className="font-medium text-sm text-gray-500">{user.email}</div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    {/* <ResponsiveNavLink href={route('profile.show')}>Profile</ResponsiveNavLink> */}
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <>
                                <ResponsiveNavLink
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Log in
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('register')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Register
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>
                </div>
            </nav>



            <div className="flex flex-col min-h-[calc(100vh-75px)]">
                <main className='bg-gray-200 dark:bg-zinc-950 flex-grow text-zinc-800 overflow-x-hidden'>{children}</main>

                {user && !route().current('designer.index') && !route().current('chat') &&(
                    <>
                        <ChatBox user_id={user.id} />
                    </>
                )}




                {!route().current('designer.index') && !route().current('chat') && (
                    <>
                        <footer class="bg-gray-300 dark:bg-zinc-950 mt-auto">
                            <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                                <div class="md:flex md:justify-between">
                                    <div class="mb-6 md:mb-0">
                                        <a href={route('dashboard')} class="flex items-center space-x-2">
                                            <ApplicationLogo />
                                            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"> Sportswear</span>
                                        </a>
                                        <div className='mt-3 text-xs text-gray-500'>
                                            <p className='mb-2'>Brgy. Mabini, San Carlos City, Pangasinan, Philippines</p>
                                            <p className='mb-2'>+63 900 000 0000</p>
                                            <p className='mb-2'>josephmislang@gmail.com</p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 text-xs">
                                        <div>
                                            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Quick Links</h2>
                                            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                                                <li class="mb-4">
                                                    {/* <Link href={route('show.products')} class="hover:underline">Products</Link> */}
                                                </li>
                                                <li class="mb-4">
                                                    {/* <Link href={route('show.products')} class="hover:underline">Size Charts</Link> */}
                                                </li>
                                                <li class="mb-4">
                                                    {/* <Link href={route('show.products')} class="hover:underline">FAQs</Link> */}
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                                            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                                                <li class="mb-4">
                                                    <a href="https://github.com/themesberg/flowbite" class="hover:underline ">Github</a>
                                                </li>
                                                <li>
                                                    <a href="https://discord.gg/4eeurUVvTy" class="hover:underline">Discord</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                                                <li class="mb-4">
                                                    <a href="#" class="hover:underline">Privacy Policy</a>
                                                </li>
                                                <li>
                                                    <a href="#" class="hover:underline">Terms &amp; Conditions</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                                <div class="sm:flex sm:items-center sm:justify-between">
                                    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="" class="hover:underline">TJM Sportswear™</a>. All Rights Reserved.
                                    </span>
                                    <div class="flex mt-4 sm:justify-center sm:mt-0">
                                        <a href="https://www.facebook.com/tjmsportswear" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                                                <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd" />
                                            </svg>
                                            <span class="sr-only">Facebook page</span>
                                        </a>

                                    </div>
                                </div>
                            </div>
                        </footer>
                    </>
                )}
            </div>

            <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
        </div>
    );
}
