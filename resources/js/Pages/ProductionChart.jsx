// resources/js/Pages/ProductCountChart.js
import React, { useState, useEffect, useMemo } from 'react';

import { Doughnut, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LineChart from '@/Components/Charts/LineChart';
import { Card, Tooltip } from 'flowbite-react';
import DoughnutCharts from '@/Components/Charts/DoughnutCharts';
import DoughnutChart from '@/Components/Charts/DoughnutChart';
import Table from '@/Components/Table';
import moment from 'moment';
import { getStatusColor } from '@/statusColors';
import { IconEye } from '@tabler/icons-react';

const ProductionChart = ({ auth }) => {
    const [chartData, setChartData] = useState(null);
    const [ordersData, setOrdersData] = useState(null);
    const [earningsData, setEarningsData] = useState(null);
    const [lineupsData, setLineupsData] = useState(null);
    const [statusData, setStatusData] = useState(null);

    const groupedData = {
        "Cut": [{ count: 10 }, { count: 20 }],
        "Neck Type": [{ count: 15 }, { count: 25 }, { count: 5 }, { count: 10 }],
        "Collar": [{ count: 30 }, { count: 40 }],
        "Button": [{ count: 20 }, { count: 10 }],
        "Short Type": [{ count: 10 }, { count: 15 }]
      };
    useEffect(() => {



        const fetchData = async () => {
            const response = await axios.get('/api/production');
            const data = response.data.variations;

            setChartData(response.data.products);
            setOrdersData(response.data.orders);
            setEarningsData(response.data.earnings);
            setLineupsData(response.data.lineups);
            setStatusData(response.data.status);

        };

        fetchData();







    }, []);

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
                Header: "Status",
                accessor: "production.status",
                Cell: ({ row }) => (
                    <p className={getStatusColor(row.original.production.status)}>
                        {row.original.production.status}
                    </p>
                )
            },

            {
                Header: "Production",
                Cell: ({ row }) => (
                    <>
                        <p>{row.original.production.start_production ? (['Finished', 'Released'].includes(row.original.production.status) ? 'Finished' : (<><div className="flex gap-1 items-center"><div className="p-1 z-50 bg-red-500 rounded-full text-sm"></div>On Going</div></>)) : 'Not Yet'}</p>
                    </>
                )
            },
            {
                Header: "Start Production",
                accessor: 'start_production',
                Cell: ({ row }) => (
                    <>
                        <p>{moment(row.original.production.start_production).format("MMMM Do, YYYY")}</p>
                    </>
                )
            },
            {
                Header: "End Production",
                accessor: 'end_production',
                Cell: ({ row }) => (
                    <>
                        <p>{moment(row.original.production.end_production).format("MMMM Do, YYYY")}</p>
                    </>
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

    return (
        <AdminLayout user={auth.admin}>
            <h1 className="font-bold text-2xl mb-4">
                Production
            </h1>
            <div className="flex gap-4">
            <LineChart />
            <DoughnutChart data2={statusData}/>
            </div>
            <Card className="dark:border-zinc-800 shadow-none dark:bg-zinc-900 rounded-lg mt-4">
                        <p className="font-bold">Orders</p>
                        {ordersData && (
                            <>
                                <Table data={ordersData} columns={columns} />
                            </>
                        )}
                    </Card>
            
            

        </AdminLayout>
    );
};

export default ProductionChart;
