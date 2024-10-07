import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LineChart from '@/Components/Charts/LineChart';
import { Card, Spinner, Tooltip } from 'flowbite-react';
import DoughnutCharts from '@/Components/Charts/DoughnutCharts';
import moment from 'moment';
import Table from '@/Components/Table';
import { getStatusColor } from '@/statusColors';
import { IconEye, IconReport } from '@tabler/icons-react';
import BarChart from '@/Components/Charts/BarChart';
import { pdf } from '@react-pdf/renderer';
import SalesReport from './Reports/SalesReport';
import PrimaryButton from '@/Components/PrimaryButton';

const Chart = ({ auth }) => {
    const [chartData, setChartData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [ordersData, setOrdersData] = useState(null);
    const [earningsData, setEarningsData] = useState(null);
    const [lineupsData, setLineupsData] = useState(null);
    const [variationsData, setVariationsData] = useState(null);
    const [filter, setFilter] = useState('yearly'); // New state for filter

    const groupedData = {
        "Cut": [{ count: 10 }, { count: 20 }],
        "Neck Type": [{ count: 15 }, { count: 25 }, { count: 5 }, { count: 10 }],
        "Collar": [{ count: 30 }, { count: 40 }],
        "Button": [{ count: 20 }, { count: 10 }],
        "Short Type": [{ count: 10 }, { count: 15 }]
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/sales?filter=${filter}`); // Pass filter as a query parameter
                const data = response.data;
                
                setChartData(data.products);
                setOrdersData(data.orders);
                setOrderData(data.sales);
                setEarningsData(data.earnings);
                setLineupsData(data.lineups);
                setVariationsData(data.variations);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [filter]); // Re-run effect when filter changes

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter); // Set the selected filter
    };

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
                Header: "Total Price",
                accessor: 'total_price',
                Cell: ({ row }) => (
                    <p>Php {row.original.total_price.toFixed(2)}</p>
                )
            },
            {
                Header: "Date Ordered",
                accessor: 'date_created',
                Cell: ({ row }) => (
                    <p>{moment(row.original.created_at).format("MMMM Do, YYYY")}</p>
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
                    </div>
                ),
            },
        ],
        []
    );

    const formattedEarnings = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
    }).format(earningsData);

    const downloadReport = async () => {
        try {
            const blob = await pdf(<SalesReport chartData={chartData} orderData={orderData} earningsData={earningsData} ordersData={ordersData} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <AdminLayout user={auth.admin}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-2xl mb-4">Sales</h1>
                <PrimaryButton onClick={downloadReport}>Report <IconReport className='ms-1' /></PrimaryButton>
            </div>
            
            {/* Filter Dropdown */}
            {orderData ? (
                <>
            <div className="mb-4">
                <select className="w-full lg:w-32 border-zinc-800 rounded-md dark:bg-zinc-900"  value={filter} onChange={(e) => handleFilterChange(e.target.value)} >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            
                    <div className='space-y-4'>
                        <div className="space-y-4 md:space-y-0 transition-all md:flex gap-4 items-start">
                            <div className="md:w-2/5 flex flex-col gap-4">
                                <div className=" h-full grid grid-cols-2 grid-rows-2 gap-4">
                                    <div className=" bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                        <h1 className="font-bold">Orders</h1>
                                        <p className="text-3xl font-bold">{orderData ? orderData : 0}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                        <h1 className="font-bold">Earnings</h1>
                                        <p className="text-3xl font-bold">{formattedEarnings ? formattedEarnings : 0}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                        <h1 className="font-bold">Lineups</h1>
                                        <p className="text-3xl font-bold">{lineupsData ? lineupsData : 0}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
                                        <h1 className="font-bold">Orders</h1>
                                        <p className="text-3xl font-bold">{orderData ? orderData : 0}</p>
                                    </div>
                                </div>
                                <Card className="dark:border-zinc-800 shadow-none dark:bg-zinc-900 rounded-lg">
                                    <p className="font-bold">Top Products</p>
                                    {chartData && (
                                        <table className='table-auto w-full text-center'>
                                            <thead>
                                                <th></th>
                                                <th className='py-2'>Name</th>
                                                <th>Number of Orders</th>
                                                <th>Total Earnings</th>
                                            </thead>
                                            <tbody>
                                                {chartData.map(product => (
                                                    <tr key={product.id} className='border-t border-1 border-gray-500'>
                                                        <td className='py-1'><img src={product.image ? `/images/products/${product.image}` : '/images/placeholder.png'} alt="" className='rounded-md h-10' /></td>
                                                        <td>{product.products.product_name}</td>
                                                        <td>{product.count}</td>
                                                        <td>Php {product.total_price.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </Card>
                            </div>

                            <div className="md:w-3/5">
                                <BarChart url={`/api/orders-per-month?filter=${filter}`} label={'Orders Per month'} title={'Orders'} />
                            </div>
                        </div>

                        <div>
                            {variationsData && (
                                <DoughnutCharts groupedData={variationsData} title={'Selected Variations in Products'} />
                            )}
                        </div>

                        <Card className="dark:border-zinc-800 shadow-none dark:bg-zinc-900 rounded-lg">
                            <p className="font-bold">Orders</p>
                            {ordersData && (
                                <Table data={ordersData} columns={columns} />
                            )}
                        </Card>
                    </div>
                </>
            ) : (
              
                    <div className="absolute inset-0 w-full h-ful flex justify-center items-center"><Spinner size={'lg'}/></div>
               
            )}
        </AdminLayout>
    );
};

export default Chart;
