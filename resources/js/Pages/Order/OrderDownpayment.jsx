import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Card, FileInput } from 'flowbite-react';
import TextInput from '@/Components/TextInput';

export default function OrderDownpayment({ auth, products, order }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        image: '',
    });


    const submitDown = (e) => {
        e.preventDefault();
        console.log(data);

        post(`/downpayment/${order.id}`, data, {
            forceFormData: true,
        })


        console.log(data);

        // Add logic to handle adding employee
         // Close the modal after adding employee
        // reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-zinc-800 dark:text-zinc-200 leading-tight">Order Downpayment</h2>}
        >
            <Head title="Order Downpayment" />

            <div className="py-12">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-zinc-200 md:w-1/2 2xl:w-1/3">
                    <h1 className='text-center font-bold mb-6 text-xl'>Order Summary</h1>
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800'>
                        <div className="flex justify-between">
                            <h3>{order.team_name}</h3>
                            <p>{order.due_date}</p>
                        </div>
                        <div className='flex gap-4 flex-wrap'>
                            {order.files.map(image => (
                                <>
                                    <img src={`/images/orders/${image.file_name}`} alt={image.file_name} className='rounded-lg h-20' />
                                </>
                            ))}
                        </div>
                        <p className="font-bold mb-2">Selected Products</p>
                        {order.products.map(product => (
                            <>

                                <div>

                                    {product.products.map(p => (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <div className='flex gap-4 items-center'>
                                                    <img src={p.image ? `/images/products/${p.image}` : '/images/placeholder.png'} alt={p.image} className='h-16 rounded-lg' />
                                                    <p>{p.product_name}</p>
                                                </div>

                                                <p>{product.subtotal}</p>

                                            </div>

                                        </>
                                    ))}
                                </div>


                                {/* {product.variations.map(v => (
                                    <>

                                        <p>{v.category.category_name}</p>
                                        <p>{v.variations.variation_name}</p>

                                    </>
                                ))} */}


                            </>
                        ))}
                         <div className='flex justify-end items-center gap-4'>
                                    <p className="opacity-50">Total</p>
                                    <p className='font-bold text-xl text-aqua'>{order.total_price.toFixed(2)}</p>

                                </div>

                        {/* {order.lineups.map(lineup => (
                            <>

                                <p></p>
                                <p> {lineup.products.product_name} {lineup.player_name} {lineup.player_details}</p>




                            </>
                        ))} */}

                        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                        <div className="text-center mb-4">
                            <p className='mb-4'>Please pay at least <i><b className='text-aqua'>Php {order.total_price * 0.45}</b></i></p>
                            <p>You can send your downpayment through our GCash account, or bank transfer.</p>
                        </div>
                        <div className="mb-4 p-4 text-center">
                            <p>GCash account number: <b>09XXXXXXXXXX</b></p>
                        </div>
                        <form onSubmit={submitDown}>
                            <div className="mb-4 text-center">
                                <p className='mb-2'>Please upload the screenshot of the transaction.</p>
                                <FileInput type="file" className='w-full dark:bg-zinc-900' required onChange={(e) => setData('image', e.target.files[0])} helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."/>
                            </div>
                            <div className='flex justify-end'>
                                <PrimaryButton disabled={processing}>Submit</PrimaryButton>
                            </div>

                        </form>
                        </div>

                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
