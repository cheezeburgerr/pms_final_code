import React, { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import PrimaryButton from './PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function ReturnRecords({ uncheckedRecords, closeable=true, onClose = () => {}}) {
    const { data, setData, put } = useForm({
        records: []
    });

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const [checkedOptionsMap, setCheckedOptionsMap] = useState(() => {
        const initialCheckedOptionsMap = {};
        uncheckedRecords.forEach(record => {
            initialCheckedOptionsMap[record.id] = {
                'Wrong Size': false,
                'Wrong Number/Detail': false,
                'Reprint': false,
                'Other Reason': false
            };
        });
        return initialCheckedOptionsMap;
    });


    useEffect(() => {
        const requestData = Object.keys(checkedOptionsMap).map(recordId => {
            const checkedOptionsList = Object.keys(checkedOptionsMap[recordId]).filter(option => checkedOptionsMap[recordId][option]);
            return {
                id: recordId,
                errorType: checkedOptionsList.join(', ')
            };
        });

        setData('records', requestData);
    }, [checkedOptionsMap, setData]);

    const handelReturns = (recordId, option) => {
        setCheckedOptionsMap(prevState => ({
            ...prevState,
            [recordId]: {
                ...prevState[recordId],
                [option]: !prevState[recordId][option]
            }
        }));

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employee.returnrecords'), data);
    };

    return (
        <div className="p-4 dark:text-gray-100">
            <h2 className="text-lg font-bold mb-4">Unchecked Records</h2>

            <form onSubmit={handleSubmit} className='p-4'>
                <table className="table-auto w-full">
                    <thead className='text-left'>
                        <tr>
                            <th>Name</th>
                            <th>Details</th>
                            <th>Errors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uncheckedRecords.map((record, index) => (
                            <tr key={index}>
                                <input type="hidden" name="ids[]" value={record.id} />
                                <td><p>{record.player_name}</p></td>
                                <td><p>{record.player_details}</p></td>
                                <td className='w-3/5'>
                                    <div className=''>
                                        {Object.keys(checkedOptionsMap[record.id]).map((option, optionIndex) => (
                                            <label key={optionIndex} className='me-4'>
                                                <Checkbox
                                                    className='me-2'
                                                    type="checkbox"
                                                    checked={checkedOptionsMap[record.id][option]}
                                                    onChange={() => handelReturns(record.id, option)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <PrimaryButton type="submit" className="btn btn-primary float-right mb-4">Update</PrimaryButton>
            </form>
        </div>
    );
}
