import { usePage } from "@inertiajs/react";
import { IconPencil } from "@tabler/icons-react";
import { Link } from "lucide-react";

export default function ProfileInfo({user}){


    return(
        <>
            <div className="p-8 flex flex-col md:flex-row justify-center items-center gap-x-16 bg-gradient-to-r from-aqua to-teal-500 rounded-xl text-gray-100 text-center w-full">
                        <div className='mb-4'>
                            <img src={user.image ? `/images/customers/profile/${user.image}` : '/images/customers/profile.jpg'} alt="" className='h-32 lg:h-48 rounded-full me-2' />
                        </div>

                        <div className="md:w-1/2">
                            <div className='flex justify-center md:justify-start items-center gap-x-4 mb-8'>
                                <h1 className="font-bold text-4xl">{user.name}</h1>
                                <div className="flex space-x-2">
                                    <Link href={route('profile.edit')}>
                                        <IconPencil color={'white'} />
                                    </Link>
                                </div>
                            </div>

                            <div className="text-left hidden md:flex gap-x-4 justify-between">
                                <div className="mb-4">
                                    <p className='font-xs'>Email</p>
                                    <p className='font-bold'>{user.email}</p>
                                </div>
                                <div className="mb-4">
                                    <p className='font-xs'>Contact Number</p>
                                    <p className='font-bold'>{user.contact_number}</p>
                                </div>
                                <div className="mb-4">
                                    <p className='font-xs'>Address</p>
                                    <p className='font-bold'>{user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
        </>
    )
}