import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconChevronDown } from '@tabler/icons-react';
import { Button, Card, Popover } from 'flowbite-react';
import Checkbox from '@/Components/Checkbox';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { getStatusColor } from '@/statusColors';

export default function Return({ auth, order }) {
    const { data, setData, put } = useForm({
        records: []
    });

    const [checkedOptionsMap, setCheckedOptionsMap] = useState(() => {
        const initialCheckedOptionsMap = {};
        order.lineups.forEach(record => {
            initialCheckedOptionsMap[record.id] = {
                'Wrong Size': false,
                'Wrong Number/Detail': false,
                'Reprint': false,
                'Other Reason': false
            };
        });
        return initialCheckedOptionsMap;
    });

    const [selectedRecords, setSelectedRecords] = useState([]);

    useEffect(() => {
        const requestData = selectedRecords.map(recordId => {
            const checkedOptionsList = Object.keys(checkedOptionsMap[recordId]).filter(option => checkedOptionsMap[recordId][option]);
            return {
                id: recordId,
                errorType: checkedOptionsList.join(', ')
            };
        });

        setData('records', requestData);
    }, [checkedOptionsMap, selectedRecords, setData]);

    const handleReturns = (recordId, option) => {
        setCheckedOptionsMap(prevState => ({
            ...prevState,
            [recordId]: {
                ...prevState[recordId],
                [option]: !prevState[recordId][option]
            }
        }));
    };

    const handleRecordSelection = (recordId) => {
        setSelectedRecords(prevState =>
            prevState.includes(recordId)
                ? prevState.filter(id => id !== recordId)
                : [...prevState, recordId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('returnrecords'), data);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Return Order" />
            <div className="py-12 dark:text-zinc-100">
                <div className="p-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="font-bold text-2xl mb-4">Return Errors</h1>
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none mb-4'>
                        <div className="flex gap-4 justify-between">
                            <div>
                                <h3 className='font-bold'>Order #{order.id} | <span className={`text-center ${getStatusColor(order.production.status)}`}>{order.production.status}</span></h3>
                                <p>{order.team_name}</p>
                                <p className='text-sm'>{moment(order.due_date).format("MMMM Do, YYYY")}</p>
                            </div>
                        </div>
                    </Card>
                    <div className="overflow-x-scroll md:overflow-x-visible">
                        <form onSubmit={handleSubmit}>
                            <table className='table-auto w-full text-center'>
                                <thead>
                                    <tr>
                                        <th className='sticky left-0 dark:bg-zinc-950 bg-gray-200'>Select</th>
                                        <th className='sticky left-0 dark:bg-zinc-950 bg-gray-200'>Reason</th>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Details</th>
                                        <th>Classification</th>
                                        <th>Gender</th>
                                        <th>Upper Size</th>
                                        <th>Lower Size</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.lineups.map(lineup => (
                                        <tr key={lineup.id}>
                                            <td className='sticky left-0 dark:bg-zinc-950 bg-gray-200 py-2'>
                                                <Checkbox
                                                    className='me-2'
                                                    checked={selectedRecords.includes(lineup.id)}
                                                    onChange={() => handleRecordSelection(lineup.id)}
                                                />
                                            </td>
                                            <td className='sticky left-0 dark:bg-zinc-950 bg-gray-200 py-2'>
                                                <Popover placement={'right'} content={
                                                    <div className='object-start text-start p-2'>
                                                        {Object.keys(checkedOptionsMap[lineup.id]).map((option, optionIndex) => (
                                                            <p key={optionIndex} className='me-4'>
                                                                <Checkbox
                                                                    className='me-2'
                                                                    type="checkbox"
                                                                    checked={checkedOptionsMap[lineup.id][option]}
                                                                    onChange={() => handleReturns(lineup.id, option)}
                                                                />
                                                                {option}
                                                            </p>
                                                        ))}
                                                    </div>
                                                }>
                                                    <Button className='w-full' color={'secondary'}>Select Reason <IconChevronDown size={18}/></Button>
                                                </Popover>
                                            </td>
                                            <td>{lineup.products.product_name}</td>
                                            <td>{lineup.player_name}</td>
                                            <td>{lineup.player_details}</td>
                                            <td>{lineup.classification}</td>
                                            <td>{lineup.gender}</td>
                                            <td>{lineup.upper_size}</td>
                                            <td>{lineup.lower_size}</td>
                                            <td>{lineup.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PrimaryButton type="submit" className="btn btn-primary float-right mb-4">Update</PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
