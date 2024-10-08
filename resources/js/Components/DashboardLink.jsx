import { Link } from '@inertiajs/react';
import { Sidebar } from 'flowbite-react';
import { useContext } from 'react';

export default function NavLink({ active = false, className = '', children, icon, text, ...props}) {


    const [isDrawerOpen, setIsDrawerOpen] = useContext(SidebarContext)
    return (
        <li className="mb-2">
            <Link
            {...props}
            className={
                'w-full py-2  transition duration-150 ease-in-out focus:outline-none items-center ' +
                (active
                    ? 'rounded-lg  bg-aqua/50 text-zinc-700 font-bold dark:text-zinc-100 focus:border-teal-700'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 focus:text-zinc-700 dark:focus:text-zinc-300 focus:border-zinc-300 dark:focus:border-zinc-700 ') +
                className
            }
        >
            {icon}
            {!isDrawerOpen && (
                <>
                {text}
                </>
            )}
        </Link>
        </li>
    );
}
