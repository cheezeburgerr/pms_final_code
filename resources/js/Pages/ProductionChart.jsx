import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Spinner, Tooltip, Select } from 'flowbite-react';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import Table from '@/Components/Table';
import moment from 'moment';
import { getStatusColor } from '@/statusColors';
import { IconEye, IconInfoCircle, IconReport } from '@tabler/icons-react';
import PrinterPieCharts from '@/Components/Charts/PrintersPieChart';
import { pdf } from '@react-pdf/renderer';
import ProductionReport from './Reports/ProductionReport';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

const ProductionChart = ({ auth }) => {
    const [ordersData, setOrdersData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [onGoingCount, setOnGoingCount] = useState(0);
    const [onGoingOrders, setOngoingOrders] = useState(null);
    const [ordersCount, setOrdersCount] = useState(0);
    const [priorityCount, setPriorityCount] = useState(0);
    const [priorities, setPriorities] = useState(0);
    const [errors, setErrors] = useState(0);
    const [errorsCount, setErrorsCount] = useState(0);
    const [printers, setPrinters] = useState(0);
    const [filterMonth, setFilterMonth] = useState(moment().format('YYYY-MM')); // Default to current month

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/production');
            const data = response.data;

            let filteredOrders = data.orders.filter(order => {
                const startProduction = moment(order.production.start_production);
                const endProduction = moment(order.production.end_production);
                const selectedMonth = moment(filterMonth);

                // Check if order is within the selected month and within production dates
                return (
                    startProduction.isSame(selectedMonth, 'month') ||
                    endProduction.isSame(selectedMonth, 'month') ||
                    (startProduction.isBefore(endProduction) &&
                        startProduction.isSameOrBefore(selectedMonth.endOf('month')) &&
                        endProduction.isSameOrAfter(selectedMonth.startOf('month')))
                );
            });

            setOrdersData(filteredOrders); // Set filtered orders
            setStatusData(data.status);
            setErrorsCount(data.errors.length);
            setPriorityCount(data.priority.length);
            setPriorities(data.priority);
            setErrors(data.errors);
            setPrinters(data.equipment);

            // Counting ongoing production orders
            const onGoingOrders = filteredOrders.filter(order =>
                order.production.start_production && !['Finished', 'Released'].includes(order.production.status)
            );
            setOnGoingCount(onGoingOrders.length);
            setOngoingOrders(onGoingOrders);

            // Counting total orders
            setOrdersCount(filteredOrders.length);
        };

        fetchData();
    }, [filterMonth]); // Re-run effect when filterMonth changes

    // Columns definition for the Table
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
                    <p>{moment(row.original.due_date).format("MMMM Do, YYYY")}</p>
                )
            },
            {
                Header: "Status",
                accessor: "production.status",
                Cell: ({ row }) => (
                    <p className={getStatusColor(row.original.production.status)}>
                        {row.original.production.status}
                    </p>
                )
            },
            {
                Header: "Priority",
                accessor: 'production.priority',
                Cell: ({ row }) => (
                    <>
                        {row.original.production.priority
                            ? <p className="font-bold bg-amber-500 text-zinc-900 p-1 px-2 rounded-full">Yes</p>
                            : <p className="font-bold p-2 rounded-full">No</p>}
                    </>
                )
            },
            {
                Header: "Production",
                Cell: ({ row }) => (
                    <p>
                        {row.original.production.start_production
                            ? ['Finished', 'Released'].includes(row.original.production.status)
                                ? 'Finished'
                                : <div className="flex gap-1 items-center"><div className="p-1 z-50 bg-red-500 rounded-full text-sm"></div>On Going</div>
                            : 'Not Yet'}
                    </p>
                )
            },
            {
                Header: "Start Production",
                accessor: 'start_production',
                Cell: ({ row }) => (
                    <p>
                        {row.original.production.start_production ? moment(row.original.production.start_production).format("MMMM Do, YYYY") : <p>Not yet proceeded</p>}
                    </p>
                )
            },
            {
                Header: "End Production",
                accessor: 'end_production',
                Cell: ({ row }) => (
                    <p>
                        {row.original.production.end_production ? moment(row.original.production.end_production).format("MMMM Do, YYYY") : <p>Not yet proceeded</p>}
                    </p>
                )
            },
            {
                Header: 'Action',
                Cell: ({ row }) => (
                    <div className='flex gap-4 justify-center items-center'>
                        <Link href={route('admin.vieworder', row.original.id)}>
                            <Tooltip content="View">
                                <IconEye className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>
                        <Link href={route('admin.production', row.original.id)}>
                            <Tooltip content="Production Details">
                                <IconInfoCircle className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>
                    </div>
                )
            }
        ],
        []
    );

    const downloadReport = async () => {
        try {
            const blob = await pdf(<ProductionReport
                ordersData={ordersData}
                onGoingCount={onGoingCount}
                ordersCount={ordersCount}
                priorityCount={priorityCount}
                errorsCount={errorsCount}
                printers={printers}
            />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <AdminLayout user={auth.admin}>
            <div className="flex w-full justify-between mb-4">
                <h1 className="font-bold text-2xl mb-4">Production</h1>
                <div className="mb-4 flex gap-3">
                    <select className="w-1/2 lg:w-48 border-zinc-800 rounded-md dark:bg-zinc-900"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    >
                        {Array.from({ length: 12 }).map((_, index) => {
                            const month = moment().subtract(index, 'months');
                            return (
                                <option key={month.format('YYYY-MM')} value={month.format('YYYY-MM')}>
                                    {month.format('MMMM YYYY')}
                                </option>
                            );
                        })}
                    </select>
                    <PrimaryButton onClick={downloadReport}>
                        Report <IconReport className='ms-1' />
                    </PrimaryButton>
                </div>

            </div>



            {ordersData ? (
                <>
                    <div className="lg:flex gap-4">
                        <div className='lg:w-full  flex flex-col mb-4 lg:mb-0'>
                            <div className="grid grid-cols-2 grid-rows-2 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4 h-full">
                                {/* Displaying statistics */}
                                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                    <h1 className="font-bold">On Going</h1>
                                    <p className="text-3xl font-bold">{onGoingCount}</p>
                                    <hr className='dark:border-zinc-800 mb-4'/>
                                    {onGoingOrders.map(o => (
                                        <>
                                            <p className='text-sm opacity-50'>{o.team_name}</p>
                                        </>
                                    ))}
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                    <h1 className="font-bold">Orders</h1>
                                    <p className="text-3xl font-bold">{ordersCount}</p>
                                    <hr className='dark:border-zinc-800 mb-4'/>
                                    {ordersData.map(o => (
                                        <>
                                            <p className='text-sm opacity-50'>{o.team_name}</p>
                                        </>
                                    ))}
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                    <h1 className="font-bold">Priority</h1>
                                    <p className="text-3xl font-bold">{priorityCount}</p>
                                    <hr className='dark:border-zinc-800 mb-4'/>
                                    {priorities.map(o => (
                                        <>
                                            <p className='text-sm opacity-50'>{o.order.team_name}</p>
                                        </>
                                    ))}
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                    <h1 className="font-bold">Errors</h1>
                                    <p className="text-3xl font-bold">{errorsCount}</p>
                                    <hr className='dark:border-zinc-800 mb-4'/>
                                    {errors.map(o => (
                                        <>
                                            <p className='text-sm opacity-50'>{o.team_name}</p>
                                        </>
                                    ))}
                                </div>
                            </div>
                            {/* Orders table */}
                            <Card className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none h-full'>
                                <table className="table-auto w-full h-full">
                                    <thead>
                                        <th>Order</th>
                                        <th>Printing Progress</th>
                                        <th>SewingProgress</th>
                                        <th>Status</th>
                                    </thead>
                                    <tbody>
                                        {ordersData && ordersData.map(o => (
                                            <>
                                                <tr>
                                                    <td>{o.team_name}</td>
                                                    <td><div className="my-2 relative w-full px-4">
                                                        {/* <h1>Printing</h1> */}
                                                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-400">
                                                            <div
                                                                style={{ width: `${o.production.printing_progress}%` }}
                                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
                                                            ></div>
                                                        </div>
                                                        <p className="mt-2 text-sm dark:text-gray-100">{o.production.printing_progress.toFixed(2)}% Complete</p>
                                                    </div></td>
                                                    <td><div className="my-2 relative w-full px-4">
                                                        {/* <h1>Sewing</h1> */}
                                                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-400">
                                                            <div
                                                                style={{ width: `${o.production.sewing}%` }}
                                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-500"
                                                            ></div>
                                                        </div>
                                                        <p className="mt-2 text-sm dark:text-gray-100">{o.production.printing_progress.toFixed(2)}% Complete</p>
                                                    </div></td>
                                                    <td><p className={`${getStatusColor(o.production.status)}`}>{o.production.status}</p></td>
                                                </tr>
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        {/* Doughnut chart */}
                        <div className="lg:w-1/2 w-full">
                        
                        <DoughnutChart data2={statusData} className={' mt-4 lg:mt-0'} title={"Status Chart"}/></div>
                    </div>
                    <h1 className='font-bold my-4'>Printers</h1>
                    <div className='mb-4'>
                        {printers && <PrinterPieCharts printers={printers} />}
                    </div>

                    <Card className=" dark:border-zinc-800 shadow-none dark:bg-zinc-900 rounded-lg mt-4">
                        <p className="font-bold">Orders</p>
                        {ordersData && (
                            <Table data={ordersData} columns={columns} />
                        )}
                    </Card>
                </>
            ) : (
                <Spinner />
            )}
        </AdminLayout>
    );
};

export default ProductionChart;
