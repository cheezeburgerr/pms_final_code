import React, { useMemo, useEffect, useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { IconAlertTriangle, IconCheck, IconCsv, IconEye, IconFilter, IconPdf, IconPrinter } from '@tabler/icons-react';
import { Popover, Toast, Tooltip } from 'flowbite-react';
import moment from 'moment';
import PrimaryButton from '@/Components/PrimaryButton';
import Table from '@/Components/Table';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { getStatusColor } from '@/statusColors';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import OrdersReport from '../Reports/OrdersReport';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import PrintModal from '@/Components/PrintModal';


const Filters = ({ showUserOrders, setShowUserOrders, filterStatus, setFilterStatus, startDate, setStartDate, endDate, setEndDate }) => {
    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    return (
        <div className=' md:flex space-y-2 md:space-y-0 gap-4 items-center'>
            <InputLabel className='flex gap-2 items-center'>
                <Checkbox onChange={() => setShowUserOrders(!showUserOrders)} /> My Teams
            </InputLabel>
            <select onChange={handleStatusChange} value={filterStatus} className='border-zinc-300 shadow-sm dark:border-zinc-800 text-sm rounded-md dark:bg-zinc-800 text-sm'>
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
    const [showPrintModal, setShowPrintModal] = useState(false);

    const [selectedMonth, setSelectedMonth] = useState(null);


    const closeModal = () => {
        setShowPrintModal(false);
    };


    // const filteredOrders = useMemo(() => {
    //     let orders = showUserOrders
    //         ? order.filter(o => o.employees.some(e => e.user_id === auth.employee.id))
    //         : order;

    //     if (filterStatus) {
    //         orders = orders.filter(o => o.production.status === filterStatus);
    //     }

    //     if (startDate && endDate) {
    //         orders = orders.filter(o => {
    //             const orderDate = moment(o.due_date);
    //             return orderDate.isBetween(startDate, endDate, 'days', '[]');
    //         });
    //     }

    //     return orders;
    // }, [order, showUserOrders, filterStatus, startDate, endDate, auth.employee.id]);
    const filteredOrders = useMemo(() => {
        let orders = showUserOrders
            ? order.filter(o => o.employees.some(e => e.user_id === auth.employee.id))
            : order;

        if (filterStatus) {
            orders = orders.filter(o => o.production.status === filterStatus);
        }

        // Filter by date range if startDate and endDate are selected
        if (startDate && endDate) {
            orders = orders.filter(o => {
                const orderDate = moment(o.due_date);
                return orderDate.isBetween(startDate, endDate, 'days', '[]');
            });
        }

        // Filter by selected month if provided
        if (selectedMonth) {
            orders = orders.filter(o => {
                const orderDate = moment(o.created_at);
                console.log(selectedMonth);
                return orderDate.month() +1 == selectedMonth; // moment.month() is 0-indexed
            });
        }

        return orders;
    }, [order, showUserOrders, filterStatus, startDate, endDate, selectedMonth, auth.employee.id]);

    
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

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
                                    <div className='absolute bottom-5 invisible group-hover:visible p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg z-50'>
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
                        <p>{moment(row.original.created_at).format("MMMM Do, YYYY")}</p>
                    </>
                )
            },
            {
                Header: 'Action',
                Cell: ({ row }) => (
                    <div className='flex gap-4 justify-center items-center'>

                        <Link href={route('employee.vieworder', row.original.id)}>
                            <Tooltip content="View">
                                <IconEye className='hover:text-aqua transition' />
                            </Tooltip>
                        </Link>
                        {row.original.production.status === 'Designing' && auth.employee.dept_id === 1 && (
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
                        {auth.employee.dept_id === 3 && (
                            <Link href={route('employee.print', row.original.id)}>
                                <Tooltip content='Print'>
                                    <IconPrinter className='hover:text-aqua transition' />
                                </Tooltip>
                            </Link>
                        )}{
                            row.original.due_date &&
                            (() => {
                                const dueDate = new Date(row.original.due_date);
                                const today = new Date();
                                const threeDaysBeforeDueDate = new Date(dueDate);
                                threeDaysBeforeDueDate.setDate(dueDate.getDate() - 3);

                                return today >= threeDaysBeforeDueDate;
                            })()
                            && (<IconAlertTriangle />)
                        }
                        {auth.employee.dept_id === 1 && row.original.production.status == 'Designing' && (
                            <>
                                <Tooltip content='Proceed to Printing' placement='bottom'>
                                    <IconPrinter
                                        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800 cursor-pointer"
                                        onClick={() => setShowPrintModal(true)}
                                    />
                                </Tooltip>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [auth.employee.dept_id, artists, handleChange]
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


    const getBase64ImageFromUrl = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const generatePDF = async () => {

        const doc = new jsPDF();

        const imageUrl = '/images/TJM_Logo.png';
        const imgData = await getBase64ImageFromUrl(imageUrl);

        doc.addImage(imgData, 'JPEG', 15, 10, 25, 13); // Add the image to the PDF

        doc.text('TJM Sportswear', 193, 10, {
            align: 'right',

        });
        doc.setFontSize(12);
        doc.text('Orders Report', 193, 16, {
            align: 'right',
        })

        doc.text('Month: ', 15, 33);
        doc.text(startDate ? moment(startDate).format('MMMM d YYYY') : "", 30, 33);

        doc.text(showUserOrders ? 'Artist:' : '', 65, 33);
        doc.text(showUserOrders ? auth.employee.name : '', 80, 33);

        doc.text(filterStatus ? 'Status:' : '', 135, 33);
        doc.text(filterStatus ? filterStatus : '', 150, 33);

        const tableColumn = ["Team Name", "Due Date", "Products", "Lineups", "Date Ordered"];
        const tableRows = [];


        filteredOrders.forEach(order => {

            const products = order.products.map(product => (product.products.map(p => `${p.product_name}`))).join(", ");
            const orderData = [
                order.team_name,
                moment(order.due_date).format('MMMM d YYYY'),
                products,
                order.lineups_count,
                moment(order.created_at).format('MMMM d YYYY'),
            ];
            tableRows.push(orderData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 35, headStyles: { fillColor: [0, 232, 222] } },);
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new tab
        const newTab = window.open();
        newTab.document.write(`<iframe src="${pdfUrl}" width="100%" height="100%" style="border:none;"></iframe>`);
    };


    const handleOpenInNewTab = async () => {
        try {
            const blob = await pdf(<OrdersReport data={filteredOrders} month={startDate ? moment(startDate).format('MMMM d YYYY') : null} status={filterStatus} artist={showUserOrders ? auth.employee.name : ''} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <EmployeeLayout
            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >

            <Modal show={showPrintModal} onClose={closeModal}>
                <PrintModal
                    orderId={order.id}
                    onClose={() => setShowPrintModal(false)}
                    onSubmit={() => handlePrintSubmit()}
                    showPrintModal
                    setShowPrintModal={() => setShowPrintModal()}
                />
            </Modal>
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

                <div className='flex gap-4'>
                <select onChange={handleMonthChange} value={selectedMonth} className='border-zinc-300 shadow-sm dark:border-zinc-800 text-sm rounded-md dark:bg-zinc-800'>
                    <option value=''>Select Month</option>
                    {Array.from({ length: 12 }, (_, index) => {
                        const monthName = moment().month(index).format("MMMM");
                        return (
                            <option key={index} value={index + 1}>{monthName}</option>
                        );
                    })}
                </select>
                <div className='space-x-2'>
                    {/* <PrimaryButton onClick={exportToCSV}><IconCsv /></PrimaryButton> */}
                    {/* <PrimaryButton onClick={exportToPDF}><IconPdf /></PrimaryButton> */}
                    {/* <PrimaryButton onClick={generatePDF}><IconPdf /></PrimaryButton> */}
                    <SecondaryButton onClick={handleOpenInNewTab}><IconPdf /></SecondaryButton>
                </div>
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
                                <PrimaryButton onClick={handleOpenInNewTab}><IconPdf /></PrimaryButton>
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
        </EmployeeLayout>
    );
}
