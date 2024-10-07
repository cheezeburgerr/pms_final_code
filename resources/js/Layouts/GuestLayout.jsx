import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen md:grid grid-cols-2 sm:justify-center items-center sm:pt-0 bg-gray-100 dark:bg-zinc-900">
            

          
            <div className='p-8 bg-black h-48 md:h-screen bg-cover' style={{ backgroundImage: `url(${'/images/basketballplayer.jpg'})` }}>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div>
            <div className="order-last lg:order-first h-screen flex justify-center items-center">
                <div className="w-full sm:max-w-md  px-6 py-4 dark:bg-transparent  overflow-hidden sm:rounded-lg">

                    {children}


                </div>
            </div>
        </div>
    );
}
