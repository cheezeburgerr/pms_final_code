import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { IconLayoutBoard, IconShirt, IconPackage, IconUserCancel, IconCheck, IconMenu, IconMenu2, IconBell, IconMessage2, IconUser, IconCoin, IconGraph, IconTable } from '@tabler/icons-react';
import { Alert, Button, Popover, Toast } from 'flowbite-react';
import NotificationBox from '@/Components/Notification/NotificationBox';
import SearchBox from '@/Components/SearchBar/SearchBox';

const SidebarContext = createContext();

export default function Admin({ user, children, alert }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const drawerRef = useRef(null);  // Reference to the drawer

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsDrawerOpen(false);
            } else {
                setIsDrawerOpen(true);
            }
        };

        handleResize();  // Run once on mount
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsDrawerOpen(false);
            }
        };

        if (window.innerWidth < 768) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDrawerOpen]);

    return (
        <div className="dark:text-white flex">
            {alert && (
                <>
                    {alert.flash.success && (
                   <div className="fixed bottom-10 left-10 z-50">
                   <Toast>
                       <span>{alert.flash.success}</span>
                       <Toast.Toggle />
                   </Toast>
               </div>
                )}
                </>
            )}
            <aside className={`text-sm z-40 transition-all duration-300 ${isDrawerOpen ? '-translate-x-0 w-60' : '-translate-x-full md:-translate-x-0 w-28'}  fixed md:static top-0`}>
                <div id="drawer-sidebar" className={`md:m-4 mr-0 rounded-lg sticky bottom-4 top-4 z-40 p-0.5 bg-zinc-950 dark:bg-zinc-900 border dark:border-zinc-800 h-screen md:h-[calc(100vh-35px)] transition-all`}>
                    <div className="mb-4 h-18">
                        <h1 className="font-bold text-lg flex items-center gap-2 dark:text-aqua px-4 py-4">
                            <img src='/images/TJM_LOGO.png' className="transition-all h-6" />
                            <p className="text-gray-100">{isDrawerOpen && 'Sportswear'}</p>
                        </h1>
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg flex items-center md:hidden">
                        <button id="drawer-toggle" onClick={() => setIsDrawerOpen(curr => !curr)}>
                            <IconMenu2 />
                        </button>

                    </div>
                    <ul className={`${isDrawerOpen ?'' : ''} p-4 transition-all`}>
                        <SidebarContext.Provider value={{ isDrawerOpen }}>
                            <SidebarItem href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon={<IconLayoutBoard />} text='Board' />
                            <SidebarItem href={route('admin.teams')} active={route().current('admin.teams')} icon={<IconPackage />} text='Orders' />
                            <div>
                            <div className="ms-2 my-4">
                                <p className='opacity-50'>Products</p>
                            <SidebarItem href={route('products.index')} active={route().current('products.index')} icon={<IconShirt />} text='Products' />
                            <SidebarItem href={route('size-chart.index')} active={route().current('size-chart.index')} icon={<IconTable />} text='Size Charts' />
                            </div>
                            </div>
                            
                            <SidebarItem href={route('employees.index')} active={route().current('employees.index')} icon={<IconUser />} text='Employees' />
                            <SidebarItem href={route('sales')} active={route().current('sales')} icon={<IconCoin />} text='Sales' />
                            <SidebarItem href={route('production')} active={route().current('production')} icon={<IconGraph />} text='Production' />
                            {user.dept_id === 2 && (
                                <>
                                    <SidebarItem href={route('admin.pending')} active={route().current('admin.pending')} icon={<IconShirt />} text='New Orders' />
                                    <SidebarItem href={route('admin.chat')} active={route().current('admin.chat')} icon={<IconMessage2 />} text='Chats' />
                                </>
                            )}
                            {user.dept_id === 1 && user.is_supervisor === 1 && <SidebarItem href={route('admin.artist')} active={route().current('admin.artist')} icon={<IconUserCancel />} text='Without Artist' />}
                            {user.dept_id === 4 && <SidebarItem href={route('checking.index')} active={route().current('checking.index')} icon={<IconCheck />} text='Checking' />}
                        </SidebarContext.Provider>
                    </ul>
                </div>
            </aside>
            <main className="w-full absolute sm:relative left-0 text-zinc-800 dark:text-zinc-100">
                <nav className="py-4 md:px-2 md:pr-6 bg-gray-200 dark:bg-zinc-950 dark:text-gray-100 z-20 sticky top-0 p-3 flex justify-between items-center">
                    <div className='flex gap-4'>
                        <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg flex items-center">
                            <button id="drawer-toggle" onClick={() => setIsDrawerOpen(curr => !curr)}>
                            <IconMenu2 />
                            </button>
                        </div>
                        <SearchBox />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">

                            <NotificationBox user_id={user.id}/>

                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 dark:bg-transparent hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                                                <img src={user.profile_image ? `/images/admin/${user.profile_image}` : '/images/customers/profile.jpg'} alt="" className='h-5 rounded-full me-2' />
                                                {user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('admin.logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <DarkModeToggle />
                    </div>
                </nav>
                <div className="p-4 md:p-2 md:pr-6">
                    {children}
                </div>
            </main>
            
        </div>
    );
}

export function SidebarItem({ active = false, className = '', icon, text, ...props }) {
    const { isDrawerOpen } = useContext(SidebarContext);

    return (
        <li className="mb-2 group relative flex items-center">
            <Link
                {...props}
                className={
                    'relative w-full p-2 hover:bg-aqua/10 rounded-lg transition duration-150 ease-in-out focus:outline-none items-center flex gap-2' +
                    (active
                        ? 'rounded-lg bg-aqua/50 text-zinc-100 font-bold dark:text-zinc-100 focus:border-teal-700'
                        : 'border-transparent text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 focus:text-zinc-700 dark:focus:text-zinc-300 focus:border-zinc-300 dark:focus:border-zinc-700 ') +
                    className
                }
            >
                <div className="">{icon}</div>
                <span
        className={`overflow-hidden transition-all ${
          isDrawerOpen ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
            </Link>
            {!isDrawerOpen && (
                <div className="absolute left-full rounded-md px-2 py-1 ml-2 bg-indigo-100 text-zinc-800 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {text}
                </div>
            )}
        </li>
    );
}
