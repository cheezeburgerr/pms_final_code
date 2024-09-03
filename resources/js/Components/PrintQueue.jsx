import { Link } from '@inertiajs/react';
import { IconEye, IconPrinter, IconUserShare } from '@tabler/icons-react';
import { Progress, Tooltip } from 'flowbite-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Table from './Table';
import { useMemo } from 'react';
import PrimaryButton from './PrimaryButton';

const ErrorTable = ({errors}) => {


    const columns = useMemo(
        () => [
            {
                Header: "Order",
                accessor: "order.team_name",

            },
            {
                Header: "Name",
                accessor: "player_name",

            },
            {
                Header: "Player Details",
                accessor: 'player_details',
            },
            {
                Header: "Upper Size",
                accessor: "upper_size",


            },
            {
                Header: "Status",
                accessor: 'status',

            },
            {
                Header: "Note",
                accessor: 'note',



            },
            {
                Header: ' ',
                Cell: ({ row }) => (
                    <div className='flex gap-4 justify-center items-center'>
                        <Link href={route('employee.vieworder', row.original.order_id)}>
                            <Tooltip content="View">
                                <IconEye className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>
                        <Link href={route('employee.reprint', row.original.order_id)}>
                            <Tooltip content="Print">
                                <IconPrinter className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>

                    </div>
                ),
            },

        ],
        []
    );
    const webSocketChannel = `errors_channel`;

    const [order, setOrder] = useState();

    const connectWebSocket = () => {
        console.log('Attempting to connect to WebSocket...');
        console.log(order)
        window.Echo.channel(webSocketChannel)
            .listen('GotError', (e) => {
                console.log('GotError event received:', e);
                fetchOrders();
            })
            .error((error) => {
                console.error('WebSocket Error:', error);
            })
            .subscribed(() => {
                console.log('Successfully connected to channel:', webSocketChannel);
            });
    }

    useEffect(() => {
        connectWebSocket();
        // fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`/api/get-errors`);
            setOrder(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching printers:', error);
        }
    };

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1>Errors to be Reprinted</h1>
 
                </div>
            <Table columns={columns} data={order ? order : errors}/>
            </div>
        </>
    )
}

const PrintQueue = ({ orders, printers, errors }) => {

    console.log(printers)
    const columns = useMemo(
        () => [
            {
                Header: "Team Name",
                accessor: "team_name",

            },
            {
                Header: "Due Date",
                accessor: 'due_date',
                Cell: ({ row }) => (
                    <>
                        <p>{moment(row.original.due_date).format("MMMM Do, YYYY")}</p>
                    </>
                )
            },
            {
                Header: "Note",
                accessor: "production.note",


            },
            {
                Header: "Printer",
                accessor: 'production.printer.equipment_name',

            },
            {
                Header: "Progress",
                accessor: 'production.printing_progress',
                Cell: ({ row }) => (
                    <>
                        <div className="my-4 relative w-full">
                            <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${row.original.production.printing_progress}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
                                ></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{row.original.production.printing_progress.toFixed(2)}% Complete</p>
                        </div>
                    </>
                )

            },

            {
                Header: ' ',
                Cell: ({ row }) => (
                    <div className='flex gap-4 justify-center items-center'>
                        <Link href={route('employee.vieworder', row.original.id)}>
                            <Tooltip content="View">
                                <IconEye className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>
                        <Link href={route('employee.print', row.original.id)}>
                            <Tooltip content="Print">
                                <IconPrinter className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>

                    </div>
                ),
            },

        ],
        []
    );
    return (
        <div className='relative lg:flex flex-row-reverse items-start gap-4 '>
            <div className="mb-4  lg:w-1/4">
                <div className='bg-purple-500 p-6  rounded-md mb-4 text-gray-100'>
                    <h1 className="font-bold text-lg mb-2">Currently Printing</h1>
                    {(() => {
                        const firstPrintingOrder = orders.find(order => order.production.note === 'Printing');
                        return firstPrintingOrder ? (<>
                            <div className="flex justify-between ">
                                <div>
                                    <p className='font-bold'>{firstPrintingOrder.team_name}</p>
                                    <div className="text-sm">
                                        <p>{moment(firstPrintingOrder.due_date).format('MMMM Do YYYY')}</p>
                                        <p>{firstPrintingOrder.products_count} Products</p>
                                        <p>{firstPrintingOrder.lineups_count} Lineups</p>
                                    </div>

                                </div>
                                <div>
                                    <Link href={route('employee.print', firstPrintingOrder.id)}>
                                        <Tooltip content='Print'>
                                            <IconPrinter />
                                        </Tooltip>
                                    </Link>
                                </div>
                            </div>
                            <div className="my-4 relative w-full">
                                <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-400">
                                    <div
                                        style={{ width: `${firstPrintingOrder.production.printing_progress}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-100 transition-all duration-500"
                                    ></div>
                                </div>
                                <p className="mt-2 text-sm text-gray-100">{firstPrintingOrder.production.printing_progress.toFixed(2)}% Complete</p>
                            </div>
                        </>) : <p>Not yet printing</p>;
                    })()}
                    <p>{orders.products_count}</p>
                </div>
                <div className='hidden lg:block'>
                    <h1 className="font-bold">Printers</h1>
                    <div className='rounded-md border dark:border-zinc-800 dark:bg-zinc-900 bg-gray-50 p-2'>
                        <table className='table auto w-full'>
                            <thead className='text-start '>
                                <th className='p-2 text-start'>Name</th>
                                <th className='p-2 text-start'>Status</th>
                                <th>Orders</th>
                            </thead>
                            <tbody>
                                {printers.map(printer => (
                                    <>
                                        <tr >
                                            <td className='px-2'>{printer.equipment_name}</td>
                                            <td className='text-purple-500'>{printer.status}</td>
                                            <td >{printer.orders_count}</td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='lg:w-3/4 space-y-4'>
                <Table data={orders.filter(order => order.production.status === 'Printing')} columns={columns} />
                    <div>

                        <ErrorTable errors={errors} />
                    </div>
            </div>

        </div>
    );
};

export default PrintQueue;
