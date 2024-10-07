
import PrimaryButton from '@/Components/PrimaryButton';

import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import React, { useState } from 'react';

import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { IconPlus } from '@tabler/icons-react';
import { Toast } from 'flowbite-react';

export default function Designs({ auth, boxes, designs, products }) {
    const { props } = usePage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        image: '',
        product_id: '',
        description: ''

    });

    const [addModal, setShowAdd] = useState(false);
    const filterGallery = (product) => {
        return gallery.filter(gal => gal.product_id === product);
    };

    const addGallery = () => {
        setShowAdd(true);
    }

    const closeAdd = () => {
        setShowAdd(false);
    }

    const addPicture = (e) => {
        e.preventDefault();
        console.log(data);

        post(route('designs.store'), data, {
            forceFormData: true,
        })


        console.log(data);

        // Add logic to handle adding employee
        setShowAdd(false); // Close the modal after adding employee
        // reset();
    };
    return (
        <EmployeeLayout user={auth.employee} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}>
            <Head title="Printers" />
            {props.flash.success && (
                <>
                    <div
                        className="fixed bottom-10 left-10 z-50 animate-slideUp transition-transform transform 
      animate-[slide-up_0.5s_ease-out_forwards]"
                    >
                        <Toast>
                            <span>{props.flash.success}</span>
                            <Toast.Toggle />
                        </Toast>
                    </div>
                </>
            )}
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl mb-8 ">Designs</h1>
                <PrimaryButton onClick={() => addGallery()} className='mb-4'>Add <IconPlus size={14} /></PrimaryButton>
            </div>
            <div>

                <div className="lg:grid grid-cols-4 gap-4">
                    {designs.map((product, index) => (
                         <div key={index} className='rounded-md cursor-pointer mb-4 dark:bg-zinc-900'>
                         <Link href={route('designs.edit', { design: product.id })} className="block">
                             <img
                                 src={`/storage/designs/${product.image}`}
                                 alt={product.name}
                                 className="h-56 w-full object-cover rounded-t-md"
                             />
                             <div className="p-4 rounded-b-md">
                                 <p className='font-bold'>{product.name}</p>
                             </div>
                         </Link>
                     </div>
                    ))}
                </div>

            </div>

            <Modal show={addModal} onClose={closeAdd} maxWidth='xl'>
                <>
                    <div className='p-4'>
                        <h1 className='font-bold text-2xl mb-4'>Add Design</h1>
                        <form onSubmit={addPicture}>
                            <div className='mb-4 w-full'>
                                <InputLabel>Name</InputLabel>
                                <TextInput type="text" name="name" required onChange={(e) => setData('name', e.target.value)} value={data.name} className='w-full' />
                            </div>
                            <div className="flex grap-x-4 mb-4">

                                <div className='mb-4 w-full me-4'>
                                    <InputLabel>Image</InputLabel>
                                    <input type="file" id="image" name="image" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required onChange={(e) => setData('image', e.target.files[0])} />
                                </div>
                                <div className='mb-4 w-full'>
                                    <InputLabel>Product</InputLabel>
                                    <select
                                        required
                                        onChange={(e) => setData('product_id', e.target.value)} value={data.product_id}
                                        className="w-full border-zinc-800 rounded-md dark:bg-zinc-900"
                                    >
                                        <option value="All">All Departments</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.product_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='mb-4'>
                                <InputLabel>Description</InputLabel>
                                <textarea type="text" name="description" className="w-full dark:bg-zinc-900 rounded-lg focus:ring-aqua" onChange={(e) => setData('description', e.target.value)} value={data.description} required />
                            </div>

                            <div className="mb-4 flex justify-end">
                                <PrimaryButton>Add</PrimaryButton>
                            </div>

                        </form>
                    </div>
                </>
            </Modal>
        </EmployeeLayout>
    );
}
