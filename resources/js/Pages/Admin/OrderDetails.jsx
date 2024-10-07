import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Card } from 'flowbite-react';
import { IconEdit, IconPackage, IconPencil, IconPhoto, IconTag, IconUser } from '@tabler/icons-react';
import moment from 'moment';
import BackButton from '@/Components/BackButton';

export default function OrderDetails({ auth, products, order }) {
    // State to track the fullscreen image
    const [fullscreenImage, setFullscreenImage] = useState(null);

    // Handler to open the image in fullscreen
    const handleImageClick = (image) => {
        setFullscreenImage(image);
    };

    // Handler to close the fullscreen image
    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <AdminLayout
            user={auth.admin}
            header={<h2 className="font-semibold text-xl text-zinc-800 dark:text-zinc-200 leading-tight">Order Details</h2>}
        >
            <Head title="Order" />

            <div className="">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <BackButton/>
                    <h1 className="font-bold text-3xl mb-4">Order Details</h1>
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800'>
                        <div className="flex justify-between">
                            <div>
                                <h3 className='font-bold'>Order #{order.id}</h3>
                                <p className='text-sm'>{moment(order.due_date).format("MMMM Do, YYYY")}</p>
                                <p className='text-sm bg-aqua px-2 rounded-full text-zinc-900 font-bold text-center'>{order.production.status}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 grid-rows-2 p-4 text-sm gap-8">
                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconPackage stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md">Team Details</h>
                                    <p><span className="opacity-50 mr-2">Team Name</span> {order.team_name}</p>
                                    <p><span className="opacity-50 mr-2">Due Date</span> {moment(order.due_date).format("MMMM Do, YYYY")}</p>
                                    <p><span className="opacity-50 mr-2">Fabric</span></p>
                                </div>
                            </div>
                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconPhoto stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md mb-4">Design</h>
                                   
                                    {order.files.map(image => (
                                        <img
                                            key={image.file_name}
                                            src={`/images/orders/${image.file_name}`}
                                            alt={image.file_name}
                                            className='h-20 rounded-md cursor-pointer'
                                            onClick={() => handleImageClick(`/images/orders/${image.file_name}`)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconUser stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md">Customer Details</h>
                                    <p><span className="opacity-50 mr-2">Name</span> {order.customer.name}</p>
                                    <p><span className="opacity-50 mr-2">Address</span> {order.customer.address}</p>
                                    <p><span className="opacity-50 mr-2">Contact Number</span> {order.customer.contact_number}</p>
                                </div>
                            </div>
                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconTag stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md">Order Price</h>
                                    <p><span className="opacity-50 mr-2">Total Price</span> {order.total_price.toFixed(2)}</p>
                                    <p><span className="opacity-50 mr-2">Downpayment</span> {order.downpayment}</p>
                                </div>
                            </div>
                        </div>
                        <h1 className=" font-bold">Products</h1>
                        <div className="">
                            {order.products.map(product => (
                                <div key={product.id} className='lg:px-8 transition rounded-md p-2 flex justify-between items-center hover:bg-zinc-900'>
                                    {product.products.map(p => (
                                        <div key={p.id} className='flex gap-4 items-center'>
                                            <img
                                                src={p.image ? `/images/products/${p.image}` : '/images/placeholder.png'}
                                                alt={p.image}
                                                className='h-16 rounded-lg cursor-pointer'
                                                onClick={() => handleImageClick(p.image ? `/images/products/${p.image}` : '/images/placeholder.png')}
                                            />
                                            <p className='font-bold text-md'>{p.product_name}</p>
                                        </div>
                                    ))}
                                    {product.variations.map(v => (
                                        <div key={v.id} className='hidden md:block'>
                                            <p className='opacity-50 mb-1 text-sm'>{v.category.category_name}</p>
                                            <p>{v.variations.variation_name}</p>
                                        </div>
                                    ))}
                                    <div className='flex gap-4'>
                                        <p className='font-bold text-aqua'>{product.subtotal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h1 className=" font-bold">Lineup</h1>
                        <div className='p-2'>
                            <table className='table-auto w-full text-center'>
                                <thead className='text-xs uppercase opacity-50'>
                                    <tr>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Number</th>
                                        <th>Classification</th>
                                        <th>Gender</th>
                                        <th>Upper Size</th>
                                        <th>Lower Size</th>
                                        <th>Remarks</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.lineups.map(lineup => (
                                        <tr key={lineup.id}>
                                            <td>{lineup.products.product_name}</td>
                                            <td>{lineup.player_name}</td>
                                            <td>{lineup.player_details}</td>
                                            <td>{lineup.classification}</td>
                                            <td>{lineup.gender}</td>
                                            <td>{lineup.upper_size ? lineup.upper_size : 'N/A'}</td>
                                            <td>{lineup.lower_size ? lineup.lower_size : 'N/A'}</td>
                                            <td>{lineup.remarks ? lineup.remarks : 'N/A'}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Fullscreen Image Overlay */}
            {fullscreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeFullscreen}>
                    <img src={fullscreenImage} alt="Fullscreen" className="max-h-full max-w-full" />
                </div>
            )}
        </AdminLayout>
    );
}
