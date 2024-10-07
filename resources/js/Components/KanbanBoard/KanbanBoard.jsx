import { Link, router } from '@inertiajs/react';
import { IconAlertTriangle, IconCheck, IconDetails, IconExclamationCircle, IconExclamationMark, IconExclamationMarkOff, IconEye, IconInfoCircle, IconPrinter, IconRefresh, IconSignLeft, IconUserShare } from '@tabler/icons-react';
import { Badge, Button, Tooltip } from 'flowbite-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PrintModal from '../PrintModal';
import Modal from '../Modal';
import Checkbox from '../Checkbox';
import TextInput from '../TextInput';

// Define KanbanCard component to represent each order
const KanbanCard = ({ order, user }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500';
            case 'Designing':
                return 'bg-blue-500';
            case 'Printing':
                return 'bg-purple-500';
            case 'Sewing':
                return 'bg-teal-500';
            case 'Finished':
                return 'bg-green-500';
            default:
                return 'bg-gray-500'; // Default color for unknown status
        }
    };

    const handlePrintSubmit = () => {
        fetchOrders()
        setShowPrintModal(false);
    };


    const setPriority = (orderId) => {
        router.post(route('employee.priority', orderId), {}, {
            onSuccess: () => {

                fetchOrders(); 
            }
        });
    };
    
    const removePriority = (orderId) => {
        router.post(route('employee.removeprio', orderId), {}, {
            onSuccess: () => {
           
                fetchOrders(); 
            }
        });
    };
    const closeModal = () => {
        setShowPrintModal(false);
    };

    return (
        <div
            className={`text-gray-100 relative flex flex-col justify-between my-6 rounded-lg shadow transition 
            ${order.due_date &&
                    (() => {
                        const dueDate = new Date(order.due_date);
                        const today = new Date();
                        const threeDaysBeforeDueDate = new Date(dueDate);
                        threeDaysBeforeDueDate.setDate(dueDate.getDate() - 3);

                        return today >= threeDaysBeforeDueDate;
                    })()
                    ? 'bg-red-500'
                    : getStatusBgColor(order.production.status)
                }`}

            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}

        >
            <div className="p-5">
                <div className='flex justify-between'>
                    <div>
                        <p className='font-bold'>{order.team_name}</p>
                        <p className='text-sm'>{moment(order.due_date).format('MMMM Do YYYY')}</p>
                        <p className='text-sm'>{order.products_count} Products</p>
                    </div>
                    <div className='flex gap-2 '>
                        {order.errors_count != 0 && (
                            <>
                                <Badge color={'warning'}>
                                    {order.errors_count} Errors
                                </Badge>
                            </>
                        )}
                        {
                            order.due_date &&
                            (() => {
                                const dueDate = new Date(order.due_date);
                                const today = new Date();
                                const threeDaysBeforeDueDate = new Date(dueDate);
                                threeDaysBeforeDueDate.setDate(dueDate.getDate() - 3);

                                return today >= threeDaysBeforeDueDate;
                            })()
                            && (
                                <>
                                    <Tooltip content="The order may be 3 days near the due date or is overdue.">
                                    <IconAlertTriangle />
                                    </Tooltip>
                                </>
                            )

                        }
                        <Link href={route('employee.vieworder', order.id)}>
                            <Tooltip content='View'>
                                <IconEye />
                            </Tooltip>
                        </Link>
                    </div>
                </div>
                <div>
                    <p className='text-sm font-bold'>{order.production.status} {order.production.note && (<>| {order.production.note}</>)}</p>


                </div>
                {order.production.priority === "Yes" && (
                    <>
                        <div className="p-1 bg-amber-500 rounded-lg px-4 absolute left-5 -bottom-4 font-bold">
                        <p className='flex gap-1'><span className='inline'><IconAlertTriangle/></span>Priority</p>
                        </div>
                    </>
                )}
                {isHovered && order.employees.find(e => e.user_id === user.id) && (
                    <div className={`bg-gray-100 absolute right-4 -bottom-4 p-2 b900 dark:bg-zinc-100 rounded-full transition flex gap-3 z-10 `}>
                        {order.production.status === 'Designing' && user.dept_id === 1 && (
                            <>
                                <Tooltip content='Proceed to Printing' placement='bottom'>
                                    <IconPrinter
                                        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800 cursor-pointer"
                                        onClick={() => setShowPrintModal(true)}
                                    />
                                </Tooltip>
                            </>
                        )}

                        {isHovered && ['Sewing'].includes(order.production.status) && user.dept_id === 4 && (



                            <Link href={route('final-checking.show', order.id)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800 ">
                                <Tooltip content='Final Checking' placement='bottom'>
                                    <IconCheck />
                                </Tooltip>
                            </Link>

                        )}

                        <Link href={route('employee.production', order.id)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800 ">
                            <Tooltip content='Production Details' placement='bottom'>
                                <IconInfoCircle />
                            </Tooltip>
                        </Link>

                        {!['Released', 'Finished'].includes(order.production.status) && (
                            <>
                                {order.production.priority !== 'Yes' ? (
                            <button onClick={() => setPriority(order.id)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800">
                                <Tooltip content='Set as Priority' placement='bottom'>
                                    <IconExclamationMark />
                                </Tooltip>
                            </button>
                        ) : (
                            <button onClick={() => removePriority(order.id)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800">
                                <Tooltip content='Remove as Priority' placement='bottom'>
                                    <IconExclamationMarkOff />
                                </Tooltip>
                            </button>
                        )}
                            </>
                        )}



                    </div>
                )}

                {isHovered && ['Printing'].includes(order.production.status) && user.dept_id === 4 && (
                    <div className="absolute right-4 -bottom-4 p-2 bg-zinc-900 dark:bg-zinc-100 rounded-full transition flex gap-3 z-50">


                        <Link href={route('checking.show', order.id)} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-800 ">
                            <Tooltip content='Check Printed' placement='bottom'>
                                <IconCheck />
                            </Tooltip>
                        </Link>
                    </div>
                )}



                <Modal show={showPrintModal} onClose={closeModal}>
                    <PrintModal
                        orderId={order.id}
                        onClose={() => setShowPrintModal(false)}
                        onSubmit={() => handlePrintSubmit()}
                        showPrintModal
                        setShowPrintModal={() => setShowPrintModal()}
                    />
                </Modal>

            </div>
            {order.production.status === 'Printing' && (
                <>
                    <div className="relative w-full overflow-hidden">
                        <p className="absolute inset-0 font-bold ml-5 text-xs text-gray-900 ">{order.production.printing_progress.toFixed(2)}% Complete</p>
                        <div className=" w-full overflow-hidden h-5 text-xs flex rounded-b-md bg-gray-400">
                            <div
                                style={{ width: `${order.production.printing_progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-100 transition-all duration-500"
                            ></div>
                        </div>

                    </div>
                </>
            )}
            {order.production.status === 'Sewing' && (
                <>
                    <div className="relative w-full overflow-hidden">
                        <p className="absolute inset-0 font-bold ml-5 text-xs text-gray-900 ">{order.production.sewing_progress.toFixed(2)}% Complete</p>
                        <div className=" w-full overflow-hidden h-5 text-xs flex rounded-b-md bg-gray-400">
                            <div
                                style={{ width: `${order.production.sewing_progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-100 transition-all duration-500"
                            ></div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

// Define KanbanBoard component
const KanbanBoard = ({ orders, user }) => {
    const webSocketChannel = `notifications_channel`;

    const [order, setOrder] = useState(orders);
    const [showUserOrders, setShowUserOrders] = useState(false);
    const [searchTerms, setSearchTerms] = useState({
        Designing: '',
        Printing: '',
        Sewing: '',
        Done: ''
    });

    // Filter orders based on the toggle switch and search term
    const filteredOrders = showUserOrders
        ? order.filter(order => order.employees.some(e => e.user_id === user.id))
        : order;

    const connectWebSocket = () => {
        window.Echo.channel(webSocketChannel).listen('GotNotif', async (e) => {
            await fetchOrders();
        });
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`/api/get-orders`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching printers:', error);
        }
    };

    useEffect(() => {
        connectWebSocket();
    }, []);

    // Sort orders into corresponding status columns and filter by search term
    const columns = {
        'Designing': filteredOrders
            .filter(order => order.production.status === 'Designing')
            .filter(order => order.team_name.toLowerCase().includes(searchTerms.Designing.toLowerCase())), // Add search filter
        'Printing': filteredOrders
            .filter(order => ['Printing', 'Printed'].includes(order.production.status))
            .filter(order => order.team_name.toLowerCase().includes(searchTerms.Printing.toLowerCase())), // Add search filter
        'Sewing': filteredOrders
            .filter(order => order.production.status === 'Sewing')
            .filter(order => order.team_name.toLowerCase().includes(searchTerms.Sewing.toLowerCase())), // Add search filter
        'Done': filteredOrders
            .filter(order => ['Finished', 'Released'].includes(order.production.status))
            .filter(order => order.team_name.toLowerCase().includes(searchTerms.Done.toLowerCase())), // Add search filter
    };

    const handleSearchChange = (status, value) => {
        setSearchTerms(prev => ({
            ...prev,
            [status]: value
        }));
    };

    return (
        <div className="md:h-[calc(100vh-148px)] flex flex-col">
            <div className="flex justify-end items-center mb-4">
                <Button color={'transparent'} onClick={fetchOrders}>
                    <IconRefresh />
                </Button>
                <label className="flex items-center">
                    <Checkbox
                        type="checkbox"
                        className="mr-2"
                        checked={showUserOrders}
                        onChange={() => setShowUserOrders(!showUserOrders)}
                    />
                    Your Teams
                </label>
            </div>

            <div className="flex-grow grid md:grid-cols-2 lg:grid-cols-4 gap-3 overflow-hidden">
                {/* Render Kanban columns */}
                {Object.keys(columns).map(status => (
                    <div
                        key={status}
                        className="flex flex-col relative overflow-hidden max-h-80 md:max-h-screen bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-semibold">{status}</h3>
                            {columns[status].length > 0 && (
                                <p className="opacity-50">{columns[status].length} Orders</p>
                            )}
                        </div>

                        {/* Search input for each column */}
                        <TextInput
                            type="text"
                            className="mb-2 p-2 w-full border rounded-md"
                            placeholder={`Search ${status} orders`}
                            value={searchTerms[status]} // Bind to state
                            onChange={(e) => handleSearchChange(status, e.target.value)} // Update state
                        />

                        <div className="flex-grow overflow-y-auto no-scrollbar rounded-md">
                            {/* Render Kanban cards for orders in the current status */}
                            {columns[status].length > 0 ? (
                                columns[status].map(order => (
                                    <KanbanCard key={order.id} order={order} user={user} />
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No orders</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default KanbanBoard;
