import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { getStatusColor } from '@/statusColors';
import { Head, Link, useForm } from '@inertiajs/react';
import { IconArrowDown } from '@tabler/icons-react';
import { Card } from 'flowbite-react'; // Import Modal component
import moment from 'moment';
import { useState } from 'react'; // Import useState

export default function Approval({ auth, order }) {
    const { data, setData, put } = useForm({
        id: order.latestapproved.id
    });

    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(''); // Store which action is triggered (approve or reject)

    const openModal = (type) => {
        setActionType(type); // Set the action type to either approve or reject
        setShowModal(true);   // Show modal
    };

    const closeModal = () => {
        setShowModal(false); // Close modal
    };

    const approveSubmit = () => {
        put(route('orders.approve')); // Submit approve request
    };

    const rejectSubmit = () => {
        put(route('orders.reject')); // Submit reject request
    };

    const handleConfirmation = () => {
        if (actionType === 'approve') {
            approveSubmit();
        } else if (actionType === 'reject') {
            rejectSubmit();
        }
        closeModal(); // Close modal after confirming
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Approval</h2>}
        >
            <Head title="Approval" />

            <div className="py-12">
                <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Design Approval</h1>
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <h3 className='font-bold'>Order #{order.id} | <span className={`text-center ${getStatusColor(order.production.status)}`}>{order.production.status}</span></h3>
                                <p>{order.team_name}</p>
                                <p className='text-sm'>{moment(order.due_date).format("MMMM Do, YYYY")}</p>
                            </div>
                            <div className='flex gap-2'>
                                <PrimaryButton type='button' onClick={() => openModal('approve')}>Approve</PrimaryButton>
                                <DangerButton type='button' onClick={() => openModal('reject')}>Reject</DangerButton>
                            </div>
                        </div>
                        <img src={`/images/orders/approvals/${order.latestapproved.image_name}`} alt={order.latestapproved.image_name} className='h-1/2 rounded-lg' />
                    </Card>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={showModal} onClose={closeModal} maxWidth='lg'>

                <div className="p-4">
                    <h2 className='font-bold text-lg'>Confirm Action</h2>
                    <hr  className='dark:border-zinc-800 mb-2'/>

                    <p>Are you sure you want to {actionType} this order?</p>
                    {actionType == 'approve' ? (
                        <>
                            <p className='mb-2'>This design will be the official design for this order and will be sent to the artist for production.</p>
                            <p className='font-bold'>Note: Once approved, there will be no changes to be done in the design since this will be final. NO REVISIONS.</p>
                            <p>Check our policy here.</p>
                        </>
                    ) : (
                        <>
                            <p>This design will be rejected and the artist will continue to send revisions to you.</p>
                        </>
                    )}


                    <div className="mt-4 flex justify-end gap-2">
                        <PrimaryButton type="button" onClick={handleConfirmation}>
                            Yes, {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                        </PrimaryButton>
                        <DangerButton type="button" onClick={closeModal}>
                            Cancel
                        </DangerButton>
                    </div>
                </div>

            </Modal>
        </AuthenticatedLayout>
    );
}
