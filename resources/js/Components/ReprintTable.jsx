import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PrimaryButton from './PrimaryButton';
import Checkbox from './Checkbox';
import Modal from './Modal'; // Import the Modal component
import SecondaryButton from './SecondaryButton';
import InputLabel from './InputLabel';
import moment from 'moment';
import ReturnRecords from './ReturnRecords';
import { router } from '@inertiajs/react';
// import ReturnRecords from './ReturnRecords';

function ReprintTable({ order }) {
    const column = [
        { title: 'Name', field: 'player_name' },
        { title: 'Details', field: 'player_details' },
        { title: 'Classification', field: 'classification' },
        { title: 'Gender', field: 'gender' },
        { title: 'Upper Size', field: 'upper_size' },
        { title: 'Short Size', field: 'lower_size' },

        // Add more columns as needed
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [lineup, setLineup] = useState(order.lineups);
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(order.production.printing_progress);
    const [uncheckedRecords, setUncheckedRecords] = useState([]); // State to hold unchecked records
    const [showModal, setShowModal] = useState(false); // State to control modal visibility


    const data = 'player_name';
    // useEffect(() => {
    //     fetchLineup();
    //     fetchProgress();
    // }, []);

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

        currentItem.status = currentItem.status === 'Printed' ? 'Reprint' : 'Printed';

        setLineup(updatedLineup);

        const newProgress = calculateProgress(updatedLineup);
        setProgress(newProgress);
        try {
            await axios.put(`/api/lineup-status/${currentItem.id}`, {
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
        const checkedLineups = lineupData.filter(item => item.status === 'Printed').length;
        return (checkedLineups / lineupData.length) * 100;
    };

    const handleFinishButtonClick = () => {

        const statusesToFilter = ['Printed', 'Finished', '1st Check'];

        const unchecked = lineup.filter(item => !statusesToFilter.includes(item.status));

        if(unchecked.length > 0){
            setUncheckedRecords(unchecked);
        setShowModal(true);
        }
        else{
            router.visit(route('employee.dashboard'), {
                onSuccess: page => {
                  page.props.flash.success = "Error successfully reprinted.";
                }
              });
        }
    };

    return (
        <div>
            <div className=" mb-4">
                <div className="columns-2 border dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-4 rounded-md shadow-none mb-4">
                    <div className="break-inside-avoid-column">
                        <div>
                            <p>Team: <span className="font-bold">{order.team_name}</span></p>

                            <p>Due Date: <span className="font-bold">{moment(order.due_date).format('MMMM Do YYYY')}</span></p>
                        </div>
                    </div>
                    <div className="break-inside-avoid-column">
                        <div className="flex items-center space-x-2 mb-4 justify-end">


                            <SecondaryButton onClick={handleFinishButtonClick}>
                                Finish
                            </SecondaryButton>

                        </div>
                        <div className="my-4 relative">
                            <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${progress}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-aqua transition-all duration-500"
                                ></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{progress.toFixed(2)}% Complete</p>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-x-auto shadow-none sm:rounded-lg border dark:border-zinc-800">
                    <div className="flex justify-between w-full p-4 bg-gray-50 dark:bg-zinc-900">
                        <div>Lineup</div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>

                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-900 dark:text-gray-400">
                            {column.map((item, index) => (
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer"
                                    key={index}
                                >
                                    {item.title}
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 cursor-pointer">Printed</th>
                        </thead>
                        <tbody>
                            {Array.isArray(lineup) && lineup.length === 0 ? (
                                <tr>
                                    <td colSpan={column.length + 1} className="px-6 py-4 text-center bg-gray-50 dark:bg-zinc-900 text-md">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                lineup.filter((item) => {
                                    if (!data || searchTerm === "") {
                                        return true;
                                    } else if (
                                        item[data]?.toLowerCase().includes(searchTerm.toLowerCase())
                                    ) {
                                        return true;
                                    }
                                    return false;
                                })
                                    .map((item, index) => (
                                        <tr
                                            className={`border-b dark:border-gray-700 ${item.status === 'Reprint' ? 'bg-red-500' : (index % 2 === 0 ? 'bg-gray-50 dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-900')}`}

                                            key={index}
                                        >
                                            {column.map((col, colIndex) => (
                                                <td className="px-6 py-4 text-gray-900 dark:text-gray-100" key={colIndex}>
                                                    <p>{item[col.field]}</p>
                                                </td>
                                            ))}
                                            <td className="px-6 py-4">
                                                <Checkbox
                                                    type="checkbox"
                                                    checked={['Printed', 'Sewing', 'Finished'].includes(item.status)}
                                                    onChange={() => handleCheckboxChange(index)}

                                                />
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* Modal for displaying unchecked records */}

                <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth='7xl'>
                    <ReturnRecords uncheckedRecords={uncheckedRecords} />
                </Modal>

        </div>
    );
}

export default ReprintTable;
