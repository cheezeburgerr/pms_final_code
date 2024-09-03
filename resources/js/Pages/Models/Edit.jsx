import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import ModelViewer from './ModelViewer';
import TextInput from '@/Components/TextInput';
import { Card, Tooltip } from 'flowbite-react';
import { IconDots, IconPlus } from '@tabler/icons-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import BackButton from '@/Components/BackButton';

export default function Edit({ auth, model }) {
    const { props } = usePage();
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteDesignId, setDeleteDesignId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        design: null,
        name: '',  // Initial state for the name input
        model_id: model.id,
    });

    const handleNameChange = (e) => {
        setData('name', e.target.value);  // Update the name field
    };

    const handleFileChange = (e) => {
        setData('design', e.target.files[0]);  // Update the design (file) field
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('model_designs.store'));  // Submit the form
        setShowModal(false);
    };

    const confirmDelete = (designId) => {
        setDeleteDesignId(designId);
        setShowDelete(true);
    };

    const deleteDesign = () => {
        router.delete(route('model_designs.destroy', deleteDesignId), {
            onSuccess: () => {
                // Optionally, you can handle successful deletion, like showing a notification
                setShowDelete(false);
            },
            onError: () => {
                // Handle errors if necessary
            }
        });
    };

    return (
        <EmployeeLayout
            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Models</h2>}
        >
            <Head title="Models" />

            <div className="flex justify-between mb-8">
            <div className='flex gap-4 items-center'>
            <BackButton/>
            <h1 className='text-2xl font-bold '>Models</h1>
            </div>
            </div>
            <div className='flex gap-4'>
                <div className="w-1/3">
                    <ModelViewer path={`/storage/models/${model.path}`} /> {/* Display the 3D model */}
                    <TextInput type="text" name="name" value={model.name} className='w-full mb-4' />
                </div>
                <div className="w-full">
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
                        <div className="flex justify-between">
                            <h1>Designs</h1>
                            <PrimaryButton onClick={() => setShowModal(true)}>Add <IconPlus size={16} /></PrimaryButton>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {model.designs.map(design => (
                                <div key={design.id} className='relative'>
                                    <Tooltip content={<div><p onClick={() => confirmDelete(design.id)}>Delete</p></div>} trigger="click">
                                        <IconDots className='absolute top-1' />
                                    </Tooltip>
                                    <img src={`/storage/${design.file}`} alt={design.name} />
                                    
                                    <h1>{design.name}</h1>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth='lg'>
                <div className="p-4">
                    <h1 className="mb-4">Add Design</h1>
                    <form onSubmit={submit}>
                        <InputLabel for="name">Name</InputLabel>
                        <TextInput
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleNameChange}
                            className="w-full mb-6"
                        />
                        <TextInput
                            type="file"
                            name="design"
                            onChange={handleFileChange}
                            className="w-full mb-6"
                        />
                        <PrimaryButton type="submit" disabled={processing}>
                            Submit
                        </PrimaryButton>
                    </form>
                </div>
            </Modal>

            <Modal show={showDelete} onClose={() => setShowDelete(false)} maxWidth='lg'>
                <div className="p-4">
                    <h1 className="mb-4">Are you sure you want to delete this design?</h1>
                    <PrimaryButton className='me-3' onClick={deleteDesign} disabled={processing}>Confirm</PrimaryButton>
                    <SecondaryButton onClick={() => setShowDelete(false)} disabled={processing}>Cancel</SecondaryButton>
                </div>
            </Modal>
        </EmployeeLayout>
    );
}
