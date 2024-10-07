import React, { useMemo, useEffect, useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { IconAlertTriangle, IconCheck, IconCsv, IconEye, IconFilter, IconInfoCircle, IconPdf, IconPrinter } from '@tabler/icons-react';
import { Popover, Toast, Tooltip } from 'flowbite-react';
import moment from 'moment';
import PrimaryButton from '@/Components/PrimaryButton';
import Table from '@/Components/Table';
import Adminlayout from '@/Layouts/AdminLayout';
import { getStatusColor } from '@/statusColors';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Admin from '@/Layouts/AdminLayout';
import { pdf } from '@react-pdf/renderer';
import OrdersReport from '../Reports/OrdersReport';
import SecondaryButton from '@/Components/SecondaryButton';

const Filters = ({ showUserOrders, setShowUserOrders, filterStatus, setFilterStatus, startDate, setStartDate, endDate, setEndDate }) => {
    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    return (
        <div className=' md:flex space-y-2 md:space-y-0 gap-4 items-center'>

            <select onChange={handleStatusChange} value={filterStatus} className='border-zinc-300 shadow-sm dark:border-zinc-800 text-sm rounded-md dark:bg-zinc-800'>
                <option value=''>All</option>
                <option value='Designing'>Designing</option>
                <option value='Printing'>Printing</option>
                <option value='Sewing'>Sewing</option>
                <option value='Finished'>Finished</option>
            </select>
            <div className="md:flex space-x-2 gap-2 items-center">
                <p>Filter Due Date:</p>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className='border-zinc-300 shadow-sm dark:border-zinc-800 text-sm rounded-md dark:bg-zinc-800'
                    placeholderText='Start Date'
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className='border-zinc-300 shadow-sm dark:border-zinc-800 text-sm rounded-md dark:bg-zinc-800'
                    placeholderText='End Date'
                />
            </div>
        </div>
    );
};



export default function Teams({ auth, order, artists }) {
    const { data, setData, post } = useForm({
        artist: '',
        role: 'Artist'
    });

    const [showUserOrders, setShowUserOrders] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const filteredOrders = useMemo(() => {
        let orders = showUserOrders
            ? order.filter(o => o.employees.some(e => e.user_id === auth.employee.id))
            : order;

        if (filterStatus) {
            orders = orders.filter(o => o.production.status === filterStatus);
        }

        if (startDate && endDate) {
            orders = orders.filter(o => {
                const orderDate = moment(o.date_created);
                return orderDate.isBetween(startDate, endDate, 'days', '[]');
            });
        }

        return orders;
    }, [order, showUserOrders, filterStatus, startDate, endDate, auth.admin.id]);

    const { props } = usePage();
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleChange = (e, id) => {
        const selectedArtist = e.target.value;
        setSelectedOrderId(id); // Set the selected order ID
        setData('artist', selectedArtist); // Update the form data
    };

    useEffect(() => {
        if (data.artist && selectedOrderId) {
            post(route('employee.assign-artist', selectedOrderId));
        }
    }, [data.artist, selectedOrderId]);

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
                Header: "Team",
                Cell: ({ row }) => (
                    <div className='flex -space-x-2'>

                        {row.original.employees.map(emp => (
                            <>
                                <div className="group relative hover:z-50">
                                    <img src={`/images/customers/${emp.employee.image != null ? emp.employee.image : 'profile.jpg'}`} alt="" className='h-5 rounded-full ' />
                                    <div className='absolute bottom-5 invisible group-hover:visible p-2 bg-zinc-900 rounded-lg z-50'>
                                        <p className='w-full font-bold'>{emp.employee.name}</p>
                                        <p className='text-xs'>{emp.employee_role}</p></div>
                                </div>
                            </>
                        ))}
                    </div>
                )
            },
            {
                Header: "Date Ordered",
                accessor: 'date_created',
                Cell: ({ row }) => (
                    <>
                        <p>{moment(row.original.date_created).format("MMMM Do, YYYY")}</p>
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
                        <Link href={route('admin.production', row.original.id)}>
                            <Tooltip content="Production Details">
                                <IconInfoCircle className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>
                        {row.original.production.status === 'Designing' && (
                            <select
                                name='artist'
                                className='border-zinc-300 shadow-sm dark:border-zinc-700 rounded-md dark:bg-zinc-800 text-sm'
                                onChange={(e) => handleChange(e, row.original.id)}  // Automatically submit form on change
                            >
                                <option disabled selected>Select</option>
                                {artists.map(artist => (
                                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                                ))}
                            </select>
                        )}
                        {
                            row.original.due_date && 
                            (() => {
                              const dueDate = new Date(row.original.due_date);
                              const today = new Date();
                              const threeDaysBeforeDueDate = new Date(dueDate);
                              threeDaysBeforeDueDate.setDate(dueDate.getDate() - 3);
                        
                              return today >= threeDaysBeforeDueDate;
                            })() 
                             && (<IconAlertTriangle/>)
                        }
                    </div>
                ),
            },
        ],
        [auth.admin.dept_id, artists, handleChange]
    );

    const exportToCSV = () => {
        const headers = ['Team Name', 'Due Date', 'Status', 'Date Ordered'];
        const rows = filteredOrders.map(order => [
            order.team_name,
            moment(order.due_date).format('MMMM Do, YYYY'),
            order.production.status,
            moment(order.date_created).format('MMMM Do, YYYY')
        ]);

        let csvContent = 'data:text/csv;charset=utf-8,'
            + headers.join(',')
            + '\n'
            + rows.map(e => e.join(',')).join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'orders.csv');
        document.body.appendChild(link);
        link.click();
    };

    const exportToPDF = () => {
        const params = new URLSearchParams({
            filterStatus,
            startDate: startDate ? startDate.toISOString() : '',
            endDate: endDate ? endDate.toISOString() : '',
            showUserOrders,
            auth_employee_id: auth.employee.id
        }).toString();

        const url = `${route('orders.exportPdf')}?${params}`;
        window.open(url, '_blank');
    };

    const handleOpenInNewTab = async () => {
        try {
          const blob = await pdf(<OrdersReport data={filteredOrders} month={startDate ? moment(startDate).format('MMMM d YYYY') : null} status={filterStatus} artist={showUserOrders ? auth.employee.name : ''}/>).toBlob();
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } catch (error) {
          console.error('Error generating PDF:', error);
        }
      };


    return (
        <Admin
            user={auth.admin}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            {props.flash.success && (
                <div className="fixed bottom-10 left-10 z-50">
                    <Toast>
                        <span>{props.flash.success}</span>
                        <Toast.Toggle />
                    </Toast>
                </div>
            )}
            <Head title="Orders Without Artist" />
            <h1 className='text-2xl font-bold mb-8'>Orders</h1>
            <div className='mb-3 hidden md:flex gap-4 items-center justify-between text-sm'>
                <Filters
                    showUserOrders={showUserOrders}
                    setShowUserOrders={setShowUserOrders}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
                <div className='space-x-2'>
                    {/* <SecondaryButton onClick={exportToCSV}><IconCsv /></SecondaryButton> */}
                    <SecondaryButton onClick={handleOpenInNewTab}><IconPdf /></SecondaryButton>
                </div>
            </div>
            <div className="md:hidden">
                <Popover content={
                    <>
                        <div className="p-4 space-y-2">
                            <Filters
                                showUserOrders={showUserOrders}
                                setShowUserOrders={setShowUserOrders}
                                filterStatus={filterStatus}
                                setFilterStatus={setFilterStatus}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                            />
                            <div className='space-x-2'>
                                <PrimaryButton onClick={exportToCSV}><IconCsv /></PrimaryButton>
                                <PrimaryButton onClick={exportToPDF}><IconPdf /></PrimaryButton>
                            </div>
                        </div>
                    </>
                } placement='right'>
                    <button><IconFilter /></button>
                </Popover>
            </div>
            <div className="dark:text-gray-100">
                <Table data={filteredOrders} columns={columns} />
            </div>
        </Admin>
    );
}
