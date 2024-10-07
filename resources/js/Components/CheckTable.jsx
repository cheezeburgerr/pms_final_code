import React, { useState } from 'react';
import moment from 'moment';
import Checkbox from './Checkbox';
import Modal from './Modal';
import ReturnRecords from './ReturnRecords';
import SecondaryButton from './SecondaryButton';

function CheckTable({ order, lineup, progress, searchTerm, setSearchTerm, handleCheckboxChange, handleFinishButtonClick, showModal, setShowModal, uncheckedRecords, status }) {
    const column = [
        { title: 'Name', field: 'player_name' },
        { title: 'Details', field: 'player_details' },
        { title: 'Classification', field: 'classification' },
        { title: 'Gender', field: 'gender' },
        { title: 'Upper Size', field: 'upper_size' },
        { title: 'Short Size', field: 'lower_size' },
        { title: 'Remarks', field: 'remarks' },
    ];

    const [errors, setErrors] = useState(order.lineups.filter(lineup => ['Replacement', 'Reprint'].includes(lineup.note)));
    const [lineups, setLineups] = useState(order.lineups.filter(lineup => 
        !['Replacement', 'Reprint'].includes(lineup.note)
    ));
    
    // Function to handle the status change for errors
    const handleErrorCheckboxChange = (index) => {
        setErrors((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index].status = updatedErrors[index].status === 'Error' ? 'Resolved' : 'Error';
            return updatedErrors;
        });
    };

    console.log(errors);
    const data = 'player_name';

    return (
        <div>
            {/* Lineup Table */}
            <div className="mb-4">
                <div className="relative shadow-none sm:rounded-lg border dark:border-zinc-800">
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
                    <div className="overflow-x-auto">
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
                                <th scope="col" className="px-6 py-3 cursor-pointer">{status}</th>
                            </thead>
                            <tbody>
                                {Array.isArray(lineups) && lineups.length === 0 ? (
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
                                                className={`border-b dark:border-gray-700 ${status !== item.status ? 'bg-red-500' : (index % 2 === 0 ? 'bg-gray-50 dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-900')}`}
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
                                                        checked={item.status === status}
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
            </div>

            {/* Errors Table */}
            <div className="mb-4">
                <div className="relative shadow-none sm:rounded-lg border dark:border-zinc-800">
                    <div className="flex justify-between w-full p-4 bg-gray-50 dark:bg-zinc-900">
                        <div>Errors</div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
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
                                <th>Status</th>
                            </thead>
                            <tbody>
                                {Array.isArray(errors) && errors.length === 0 ? (
                                    <tr>
                                        <td colSpan={column.length + 1} className="px-6 py-4 text-center bg-gray-50 dark:bg-zinc-900 text-md">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : (
                                    errors.filter((item) => {
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
                                                className="border-b dark:border-gray-700 dark:bg-zinc-900"
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
                                                        checked={item.status === 'Resolved'}
                                                        onChange={() => handleErrorCheckboxChange(index)}
                                                    />
                                                    <span>{item.status}</span>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth='7xl'>
                <ReturnRecords uncheckedRecords={uncheckedRecords} />
            </Modal>
        </div>
    );
}

export default CheckTable;
