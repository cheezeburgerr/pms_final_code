import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import OrderDetails from '@/Components/OrderDetails';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

import moment from 'moment';
import { usePage } from '@inertiajs/react';
import { Alert } from 'flowbite-react';
import { IconBrush, IconClock, IconCube, IconEye, IconHourglass, IconPencil, IconShoppingBag, IconX } from '@tabler/icons-react';
import { getStatusColor } from '@/statusColors';

export default function Profile({ auth, mustVerifyEmail, status, orders }) {
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const rootUrl = "http://127.0.0.1:8000";
    const [viewIndex, setViewIndex] = useState(null);

    const { props } = usePage();
    const viewOrder = (index) => {
        setViewIndex(index);
    };

    const closeModal = () => {
        setViewIndex(null);
    };

    const countOrdersByStatus = (statuses) => {
        if (Array.isArray(statuses)) {
            return orders.filter(order => statuses.includes(order.production.status)).length;
        }
        return orders.filter(order => order.production.status === statuses).length;
    };

    const viewOrders = (statuses) => {
        let filtered = [];
        if (Array.isArray(statuses)) {
            filtered = orders.filter(order => statuses.includes(order.production.status));
        } else {
            filtered = orders.filter(order => order.production.status === statuses);
        }
        setFilteredOrders(filtered);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12 dark:text-zinc-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 ">
                    <div className="p-8 flex flex-col md:flex-row justify-center items-center gap-x-16 bg-gradient-to-r from-aqua to-teal-500 rounded-xl text-gray-100 text-center w-full">
                        <div className='mb-4'>
                            <img src={auth.user.image ? `/images/customers/profile/${auth.user.image}` : '/images/customers/profile.jpg'} alt="" className='h-32 lg:h-48 rounded-full me-2' />
                        </div>

                        <div className="md:w-1/2">
                            <div className='flex justify-center md:justify-start items-center gap-x-4 mb-8'>
                                <h1 className="font-bold text-4xl">{auth.user.name}</h1>
                                <div className="flex space-x-2">
                                    <Link href={route('profile.edit')}>
                                        <IconPencil color={'white'} />
                                    </Link>
                                </div>
                            </div>

                            <div className="text-left hidden md:flex gap-x-4 justify-between">
                                <div className="mb-4">
                                    <p className='font-xs'>Email</p>
                                    <p className='font-bold'>{auth.user.email}</p>
                                </div>
                                <div className="mb-4">
                                    <p className='font-xs'>Contact Number</p>
                                    <p className='font-bold'>{auth.user.contact_number}</p>
                                </div>
                                <div className="mb-4">
                                    <p className='font-xs'>Address</p>
                                    <p className='font-bold'>{auth.user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' px-4 md:px-8'>
                        <p className="font-bold mb-4">Orders</p>
                        <div className="grid grid-cols-3 gap-8  md:flex gap-x-4 items-start justify-between text-center">
                            <div className='flex flex-col items-center w-full'>
                                <div className="relative cursor-pointer" onClick={() => viewOrders('Pending')}>
                                    {countOrdersByStatus('Pending') !== 0 && (
                                        <p className='absolute bg-teal-500 p-2 rounded-full left-3 -top-3 text-xs text-gray-100 py-1'>{countOrdersByStatus('Pending')}</p>
                                    )}
                                    <IconHourglass />
                                </div>
                                <p>Pending</p>
                            </div>
                            <div className='flex flex-col items-center w-full' onClick={() => viewOrders('Designing')}>
                                <div className="relative cursor-pointer">
                                    {countOrdersByStatus('Designing') !== 0 && (
                                        <p className='absolute bg-teal-500 p-2 rounded-full left-3 -top-3 text-xs text-gray-100 py-1'>{countOrdersByStatus('Designing')}</p>
                                    )}
                                    <IconBrush />
                                </div>
                                <p>Designing</p>
                            </div>
                            <div className='flex flex-col items-center w-full' onClick={() => viewOrders(['Printing', 'Sewing'])}>
                                <div className="relative cursor-pointer">
                                    {countOrdersByStatus(['Printing', 'Sewing']) !== 0 && (
                                        <p className='absolute bg-teal-500 p-2 rounded-full left-3 -top-3 text-xs text-gray-100 py-1'>{countOrdersByStatus(['Printing', 'Sewing'])}</p>
                                    )}
                                    <IconClock />
                                </div>
                                <p className='truncate'>In Production</p>
                            </div>
                            <div className='flex flex-col items-center w-full' onClick={() => viewOrders('Finished')}>
                                <div className="relative cursor-pointer">
                                    {countOrdersByStatus('Finished') !== 0 && (
                                        <p className='absolute bg-teal-500 p-2 rounded-full left-3 -top-3 text-xs text-gray-100 py-1'>{countOrdersByStatus('Finished')}</p>
                                    )}
                                    <IconShoppingBag />
                                </div>
                                <p className='truncate'>To Pickup</p>
                            </div>
                            <div className='flex flex-col items-center w-full' onClick={() => viewOrders('Released')}>
                                <div className="relative cursor-pointer">
                                    {countOrdersByStatus('Released') !== 0 && (
                                        <p className='absolute bg-teal-500 p-2 rounded-full left-3 -top-3 text-xs text-gray-100 py-1'>{countOrdersByStatus('Released')}</p>
                                    )}
                                    <IconCube />
                                </div>
                                <p>Received</p>
                            </div>
                            <div className='flex flex-col items-center w-full' onClick={() => viewOrders('Cancelled')}>
                                <div className="relative cursor-pointer">
                                {countOrdersByStatus(['Cancelled', 'Overdue']) !== 0 && (
                                        <p className='absolute bg-teal-500 p-2 rounded-full left-3 -top-3 text-xs text-gray-100 py-1'>{countOrdersByStatus(['Cancelled', 'Overdue'])}</p>
                                    )}
                                    <IconX />
                                </div>
                                <p>Cancelled</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 w-full p-8">
                        <div className="p-4 sm:p-8 bg-white dark:bg-zinc-900 rounded-lg">
                            <h3 className='font-bold font-Panchang'>Your Orders</h3>
                            <hr className='dark:border-zinc-800'/>
                            <div>
                                {filteredOrders.map((order, index) => (
                                    <div key={order.id}>
                                        <div className='flex justify-between mb-4 p-4 gap-x-4 items-center'>
                                            <div className="w-full">
                                                <div className="flex gap-4 items-center">
                                                    <p className='font-bold text-lg'>{order.team_name}</p>
                                                    <p className={`${getStatusColor(order.production.status)} `}>{order.production.status}</p>{order.latestapproved && ( <>
                                                        {order.latestapproved.status != 'Approved' && (
                                                            <p className="animate-pulse text-aqua">Waiting for Approval</p>
                                                        )}
                                                    </>)}
                                                </div>
                                                <p className='text-sm'>{moment(order.due_date).format('MMMM Do YYYY')}</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className=' text-gray-100 px-2 bg-gray-900 rounded-full'>{order.status}</p>
                                                <div className="flex gap-x-2 justify-end">
                                                    <Link href={`/orders/${order.id}`}>
                                                        <IconEye />
                                                    </Link>
                                                    {['Pending', 'Designing', 'Approved'].includes(order.status) && (
                                                        <Link href={`/order/${order.order_id}/edit`}>
                                                            <IconPencil />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className='dark:border-zinc-800' />
                                    </div>
                                ))}

                                {filteredOrders === null && (
                                    <div className="w-full">
                                        <p>No orders found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {viewIndex !== null && (
                <Modal show={true} onClose={closeModal}>
                    <OrderDetails edit={true} order={orders[viewIndex]} />
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
