import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function LoginLayout({ children, user }) {

    return (
        <div className={`min-h-screen sm:justify-center items-center sm:pt-0 bg-gray-300 dark:bg-zinc-950`}>




            <div className="h-screen flex justify-center items-center">
                <div className={`w-full sm:max-w-md hover:scale-105 transition ease-in px-6 py-6 dark:bg-zinc-900 bg-gray-200 overflow-hidden sm:rounded-lg`}>

                    {children}


                </div>
            </div>
        </div>
    );
}
