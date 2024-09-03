
import KanbanBoard from '@/Components/KanbanBoard/KanbanBoard';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Card, Progress } from 'flowbite-react';
import PrintQueue from '@/Components/PrintQueue';
import moment from 'moment';
import { getStatusColor } from '@/statusColors';
import SendDesign from '@/Components/SendDesign';
import SecondaryButton from '@/Components/SecondaryButton';
import { IconPrinter, IconSendOff, IconUserShare } from '@tabler/icons-react';
import BackButton from '@/Components/BackButton';

const ApprovalWaiting = ({order}) => {


    const { data, setData, put } = useForm({

    });
    return (
        <>
        <div className='space-y-4'>
        <Card className='dark:bg-zinc-900 dark:border-zinc-800'>
            <h1 className="font-bold mb-4">Approval Status</h1>
            <p>{order.latestapproved.status}</p>
            <img src={`/images/orders/approvals/${order.latestapproved.image_name}`} alt={order.latestapproved.image_name}  className='rounded-lg'/>
        </Card>
        <Card className='dark:bg-zinc-900 dark:border-zinc-800 '>
        <h1 className="font-bold">Approval History</h1>
                {order.approved.map(approval => (
                    <>
                        <div className="flex justify-between">
                            <div>
                                <p>{approval.status}</p>
                                <small>{approval.created_at}</small>
                            </div>
                            <img src={`/images/orders/approvals/${approval.image_name}`} alt={approval.image_name} className='rounded-lg h-12' />
                        </div>
                    </>
                ))}
            </Card>
        </div>
        </>
    )
}


const PrintingInfo = ({order, dept_id}) => {
    const { data, setData, put } = useForm({

    });


    const reprintSubmit = (e) => {
        e.preventDefault();
        put(route('reprint.errors', order.id));
    }

    return (
        <>
        <div className='space-y-4'>
        <Card className='bg-aqua dark:bg-aqua dark:border-zinc-700 text-zinc-900 shadow-none'>
            <h1 className="font-bold mb-2">Production Status</h1>
            <div>
            <h1 className="font-bold text-2xl mb-2">{order.production.status} </h1>
            <p><span className="opacity-50">Printer:</span> {order.production.printer.equipment_name}</p>
            <p><span className="opacity-50">Products:</span> {order.products_count}</p>
            <p><span className="opacity-50">Lineup:</span> {order.lineups_count}</p>
            <p><span className="opacity-50">Lineup Errors:</span> {order.errors_count}</p>
            </div>
        </Card>
        <Card className='dark:bg-zinc-900 dark:border-zinc-700 shadow-none'>
            <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold">Errors ({order.errors_count})</h1>
            {dept_id === 1 && (
                <>
                <form onSubmit={reprintSubmit} method='post'>
            <PrimaryButton type='submit'>
                    Reprint Errors
                </PrimaryButton>

            </form>
                </>
            )}


            </div>
            <table className='table-auto w-full'>
                <thead>
                    <th className='text-start'>Name</th>

                    <th >Note</th>
                </thead>
                <tbody>
                {order.errors.map(error => (
                <>
                    <tr >
                        <td><p>{error.player_name}</p></td>

                        <td className='text-aqua text-center'><p>{error.note}</p></td>
                    </tr>
                </>
            ))}
                </tbody>
            </table>
        </Card>

        </div>
        </>
    )
}


export default function ProductionDetails({ auth, boxes, order, printers }) {



    // Determine which component to render based on department_id
    const componentToRender = order.production.status === 'Designing'
        ? order.latestapproved != null ?  <><ApprovalWaiting order={order}/></> : <></>
        : <PrintingInfo order={order} dept_id={auth.employee.dept_id} />


        const release = (e) => {

            e.preventDefault()
            router.put(route('employee.release', order.production.id), {
                status: 'Released',
                message: 'Order Paid and Released'
            })
        };

    return (
        <AdminLayout

            user={auth.admin}
            header={<h2 className="font-semibold text-xl text-gray-900 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >

            <Head title="Production Details" />

            <BackButton/>
            <div className="flex justify-between">
                
            <h1 className='text-2xl font-bold mb-8 '>Production Details</h1>
            {order.production.status === 'Designing' && (
                <>
                <div className='space-x-2'>
                <SecondaryButton><IconPrinter /></SecondaryButton>
                <SecondaryButton><IconUserShare /></SecondaryButton>
            </div>
                </>
            )}
            {order.production.status === 'Finished' && (
                <>
                <div className='space-x-2'>

                <PrimaryButton onClick={release}>Release</PrimaryButton>

            </div>
                </>
            )}
            </div>
            <div className="dark:text-gray-100 relative lg:flex gap-4 space-y-4 lg:space-y-0    ">
                <div className='lg:w-3/4 space-y-4'>
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
                        <div className="flex gap-4 justify-between">
                            <div>
                                <h3 className='font-bold'>Order #{order.id} | <span className={`text-center ${getStatusColor(order.production.status)}`}>{order.production.status}</span></h3>
                                <p>{order.team_name}</p>
                                <p className='text-sm'>{moment(order.due_date).format("MMMM Do, YYYY")}</p>
                            </div>
                            {order.production.status === 'Printing' && (
                                <>
                                    <div className="my-2 relative w-1/2">
                                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-400">
                                            <div
                                                style={{ width: `${order.production.printing_progress}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-sm dark:text-gray-100">{order.production.printing_progress.toFixed(2)}% Complete</p>
                                    </div>
                                </>
                            )}
                            {order.production.status === 'Sewing' && (
                                <>
                                    <div className="my-2 relative w-1/2">
                                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-400">
                                            <div
                                                style={{ width: `${order.production.sewing_progress}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-100 transition-all duration-500"
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-100">{order.production.sewing_progress.toFixed(2)}% Complete</p>
                                    </div>
                                </>
                            )}
                        </div>

                    </Card>
                    <Card className='hidden lg:block dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>

                    <h1 className=" font-bold">Products</h1>
                        <div className="">
                            {order.products.map(product => (
                                <>
                                    <div className=' lg:px-8 transition rounded-md p-2 flex justify-between items-center dark:hover:bg-zinc-900'>
                                        {product.products.map(p => (
                                            <>
                                                <div className='flex gap-4 items-center'>
                                                    <img src={p.image ? `/images/products/${p.image}` : '/images/placeholder.png'} alt={p.image} className='h-16 rounded-lg' />
                                                    <p className='font-bold text-md'>{p.product_name}</p>
                                                </div>

                                            </>
                                        ))}

                                        {product.variations.map(v => (
                                            <>

                                                <div className='hidden md:block'>
                                                    <p className='opacity-50 mb-1 text-sm'>{v.category.category_name}</p>
                                                    <p>{v.variations.variation_name}</p>
                                                </div>

                                            </>
                                        ))}
                                        <div className='flex gap-4'>
                                            <p className='font-bold text-aqua'>{product.subtotal}</p>


                                        </div>
                                    </div>

                                </>
                            ))}
                        </div>
                    </Card>
                    <Card className='hidden lg:block dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
                    <h1 className=" font-bold">Lineup</h1>
                        <div className='p-2'>
                            <table className='table-auto w-full text-center'>
                                <thead className='text-xs uppercase opacity-50'>
                                    <tr>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Number</th>
                                        <th>Classification</th>
                                        <th>Gender</th>
                                        <th>Upper Size</th>
                                        <th>Lower Size</th>
                                        <th>Remarks</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.lineups.map(lineup => (
                                        <tr key={lineup.id}>
                                            <td>{lineup.products.product_name}</td>
                                            <td>{lineup.player_name}</td>
                                            <td>{lineup.player_details}</td>
                                            <td>{lineup.classification}</td>
                                            <td>{lineup.gender}</td>
                                            <td>{lineup.upper_size ? lineup.upper_size : 'N/A'}</td>
                                            <td>{lineup.lower_size ? lineup.lower_size : 'N/A'}</td>
                                            <td>{lineup.remarks ? lineup.remarks : 'N/A'}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div className="lg:w-1/4">
                    {componentToRender}</div>
            </div>








        </AdminLayout>
    );
}
