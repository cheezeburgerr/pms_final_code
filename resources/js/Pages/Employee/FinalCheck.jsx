import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head, router } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import CheckTable from '@/Components/CheckTable';
import SecondaryButton from '@/Components/SecondaryButton';
import moment from 'moment';

export default function FinalCheck({ auth, order }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [lineup, setLineup] = useState(order.lineups.filter(lineup => lineup.note != 'Replacement'));

    const [uncheckedRecords, setUncheckedRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);



    const fetchLineup = async () => {
        try {
            const response = await axios.get(`/api/get-lineup/${order.id}`);
            setLineup(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching lineup:', error);
        }
    }

    const fetchProgress = async () => {
        try {
            const response = await axios.get(`/api/get-progress/${order.order_id}`);
            setProgress(response.data.progress);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    }

    const handleCheckboxChange = async (index) => {
        const updatedLineup = [...lineup];
        const currentItem = updatedLineup[index];
        currentItem.status = currentItem.status === 'Finished' ? '1st Check' : 'Finished';
        setLineup(updatedLineup);

        const newProgress = calculateProgress(updatedLineup);
        setProgress(newProgress);
        try {
            router.put(route('final-checking.update', currentItem.id), {
                orderId: order.id,
                prodId: order.production.id,
                lineupId: currentItem.id,
                printed: currentItem.status,
                progress: newProgress
            });
            console.log('Printed status updated successfully.');
        } catch (error) {
            console.error('Error updating printed status:', error);
        }
    };

    const calculateProgress = (lineupData) => {
        if (lineupData.length === 0) return 0;
        const checkedLineups = lineupData.filter(item => item.status === 'Finished').length;
        return (checkedLineups / lineupData.length) * 100;
    };

    const [progress, setProgress] = useState(calculateProgress(order.lineups.filter(lineup => lineup.status != 'Error')));

    const handleFinishButtonClick = (e) => {
        const statusesToFilter = ['Finished'];
        const unchecked = lineup.filter((item) => !statusesToFilter.includes(item.status));
        setUncheckedRecords(unchecked);

        if (unchecked.length === 0) {
            // Redirect to dashboard if no unchecked records
            e.preventDefault()
            router.put(route('employee.changestatus', order.production.id), {
                status: 'Finished',
                role: 'Final Checker',
                message: 'Order Proceeded to Releasing Process',
                customer: order.customer_id,
                dont: true
            })
        } else {
            setShowModal(true);
        }
    };

    return (
        <EmployeeLayout
            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Final</h2>}
        >
            <Head title="Dashboard" />
            <h1 className='text-2xl font-bold mb-8 '>Final Checking</h1>
            <div className="columns-2 border dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-4 rounded-md shadow-none mb-4">
                <div className="break-inside-avoid-column">
                    <div>
                        <p>Team: <span className="font-bold">{order.team_name}</span></p>
                        <p>Due Date: <span className="font-bold">{moment(order.due_date).format('MMMM Do YYYY')}</span></p>
                    </div>
                </div>
                <div className="break-inside-avoid-column">
                    <div className="my-4 relative">
                        <div className="flex items-center space-x-2 mb-4 justify-end">


                            <SecondaryButton onClick={handleFinishButtonClick}>
                                Finish
                            </SecondaryButton>

                        </div>
                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">

                            <div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-aqua transition-all duration-500"
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{progress.toFixed(2)}% Finished</p>
                    </div>
                </div>
            </div>
            <div className="dark:text-gray-100">
                <CheckTable
                    order={order}
                    lineup={lineup}
                    progress={progress}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleCheckboxChange={handleCheckboxChange}
                    handleFinishButtonClick={handleFinishButtonClick}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    uncheckedRecords={uncheckedRecords}
                    status='Finished'
                />
            </div>
        </EmployeeLayout>
    );
}
