import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Card, Tooltip } from 'flowbite-react';
import moment from 'moment';
import { IconEdit, IconPackage, IconPencil, IconPhoto, IconPlus, IconReport, IconTag, IconUser } from '@tabler/icons-react';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { getStatusColor } from '@/statusColors'; // Import the getStatusColor function
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import OrdersReport from '../Reports/OrdersReport';
import OrderReport from '../Reports/OrderReport';

export default function OrderDetails({ auth, products, order }) {

    const { data, setData, put, processing, errors } = useForm({
        status: 'Cancelled', // State to hold selected printer
    });

    const [editable, setEditable] = useState(['Designing', 'Pending'].includes(order.production.status));
    const [modal, setModal] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const handleImageClick = (image) => {
        setFullscreenImage(image);
    };

    // Handler to close the fullscreen image
    const closeFullscreen = () => {
        setFullscreenImage(null);
    };



    const closeModal = () => {
        setModal(false);
    }

    const cancelSubmit = (e) => {
        e.preventDefault();
        put(route('cancel.order', order.id), {
        });
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
        doc.text('Order Form', 193, 16, {
            align: 'right',
        } )

        doc.setFontSize(14);
        doc.text('Team Name:', 15, 33 );
        doc.text(order.team_name, 60, 33 );
        doc.text('Due Date:', 120, 33 );
        doc.text(order.due_date, 150, 33 );
        doc.text('Team Name:', 15, 38 );
        doc.text(order.team_name, 60, 38 );
        doc.text('Due Date:', 120, 38 );
        doc.text(order.due_date, 150, 38 );

        const tableColumn = ["Product", "Player Name", "Details", "Classification", "Gender", "Upper", "Lower", "Remarks"];
        const tableRows = [];


        order.lineups.forEach(lineup => {


          const lineupData = [
            lineup.player_name,
            lineup.player_details,
            lineup.classification,
            lineup.gender,
            lineup.upper_size,
            lineup.lower_size,
            lineup.remarks,
          ];
          tableRows.push(lineupData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 45, headStyles :{fillColor : [0, 232, 222]} }, );
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new tab
        const newTab = window.open();
        newTab.document.write(`<iframe src="${pdfUrl}" width="100%" height="100%" style="border:none;"></iframe>`);
      };

      const handleOpenInNewTab = async () => {
        try {
          const blob = await pdf(<OrderReport data={order} />).toBlob();
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } catch (error) {
          console.error('Error generating PDF:', error);
        }
      };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-zinc-800 dark:text-zinc-200 leading-tight">Order Details</h2>}
        >
            <Head title="Order" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-zinc-200">
                    <h1 className="font-bold text-3xl mb-4">Order Details</h1>
                    {order.latestapproved && (
                        <>
                            {order.latestapproved.status != 'Approved' && (
                                <Card className='animate-pulse bg-gradient-to-r from-aqua to-purple-500 dark:border-zinc-800 mb-4'>
                                <div className="w-full flex gap-4 justify-between">
                                    <div>
                                        <p className="font-extrabold text-xl text-zinc-900">Waiting for Approval</p>
                                        <p className='text-zinc-900'>The artist sent you the design for this particular order. Check it out.</p>
                                    </div>
                                    <div>
                                        <Link href={route('orders.approval', order.id)}>
                                            <SecondaryButton>
                                                Check
                                            </SecondaryButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                            )}
                        </>
                    )}
                    {order.production.status == 'Overdue' && (
                        <>
                            <Card className='bg-red-500 dark:bg-red-500 dark:border-zinc-800 mb-4'>
                                <div className="w-full  justify-between">
                                    <p className='font-extrabold text-xl'>Order Overdue</p>
                                    <p>Order production did not finished in due time. Sorry for the inconvenience. Please contact our customer service for other concerns.</p>
                                </div>
                            </Card>
                        </>
                    )}
                   
                    <Card className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
                        <div className="flex justify-between">
                            <div>
                                <h3 className='font-bold'>Order #{order.id} | <span className={`text-center ${getStatusColor(order.production.status)}`}>{order.production.status}</span></h3>
                                <p className='text-sm'>{moment(order.due_date).format("MMMM Do, YYYY")}</p>

                            </div>
                            <div className='flex items-center gap-4'>
                                <IconReport onClick={handleOpenInNewTab} className='cursor-pointer'/>

                                {order.production.status === 'Pending' && (
                                    <>
                                        <DangerButton onClick={() => (setModal(true))}>
                                            Cancel Order
                                        </DangerButton>

                                        <Modal show={modal} onClose={closeModal}>
                                            <div className='p-4 dark:text-gray-100'>
                                                <h1 className='font-bold'>Cancel Order?</h1>
                                                <p>Do you really want to cancel your order?</p>

                                                <form onSubmit={cancelSubmit}>
                                                    <div className="flex justify-end gap-4">
                                                        <SecondaryButton onClick={closeModal}>
                                                            No
                                                        </SecondaryButton>
                                                        <DangerButton type="submit">
                                                            Yes
                                                        </DangerButton>
                                                    </div>
                                                </form>
                                            </div>

                                        </Modal>
                                    </>
                                )}
                                {editable && (
                                    <>
                                        <Link href={route('orders.edit', order.id)}>
                                            <IconEdit />
                                        </Link>
                                    </>
                                )}
                                {order.production.status === 'Released' && (
                                    <>
                                        <Link href={route('orders.return', order.id)}>
                                            <PrimaryButton>Return Errors</PrimaryButton>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
<hr className='dark:border-zinc-800' />
                        <div className="md:grid space-y-4 md:space-y-0 grid-cols-2 grid-rows-2 p-4 text-sm gap-8">
                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconPackage stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md">Team Details</h>
                                    <p><span className="opacity-50 mr-2">Team Name</span> {order.team_name}</p>
                                    <p><span className="opacity-50 mr-2">Due Date</span> {moment(order.due_date).format("MMMM Do, YYYY")}</p>
                                    <p><span className="opacity-50 mr-2">Fabric</span></p>
                                </div>
                            </div>
                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconPhoto stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md mb-4">Design</h>
                                    <div className='flex gap-4'>
                                    {order.latestapproved && (
                                        <>
                                        {order.latestapproved.status == 'Approved' && (
                                            <div className='relative'>
                                                <Tooltip content="Approved">
                                                <div className="absolute -left-1 -bottom-1 p-2 bg-green-500 rounded-full"></div>
                                                </Tooltip>
                                                <img src={`/images/orders/approvals/${order.latestapproved.image_name}`} alt={order.latestapproved.image_name} className='h-20 rounded-lg' />
                                            </div>
                                        )}
                                        </>
                                    )}
                                    {order.files.map(image => (
                                        <>
                                            <img
                                                key={image.file_name}
                                                src={`/images/orders/${image.file_name}`}
                                                alt={image.file_name}
                                                className='h-20 rounded-lg cursor-pointer'
                                                onClick={() => handleImageClick(`/images/orders/${image.file_name}`)}
                                            />

                                        </>
                                    ))}
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconUser stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md">Customer Details</h>
                                    <p><span className="opacity-50 mr-2">Name</span> {order.customer.name}</p>
                                    <p><span className="opacity-50 mr-2">Address</span> {order.customer.address}</p>
                                    <p><span className="opacity-50 mr-2">Contact Number</span> {order.customer.contact_number}</p>
                                </div>
                            </div>
                            <div className='flex gap-4 items-start'>
                                <div className="rounded-full bg-zinc-200 dark:bg-zinc-900 p-2">
                                    <IconTag stroke={1.5} />
                                </div>
                                <div>
                                    <h className="font-bold text-md">Order Price</h>
                                    <p><span className="opacity-50 mr-2">Total Price</span> {order.total_price.toFixed(2)}</p>
                                    <p><span className="opacity-50 mr-2">Downpayment</span> {order.downpayment ? <>{order.downpayment}</> : <><Link href={route('orders.downpayment', order.id)}><PrimaryButton disabled={order.production.status == 'Overdue'}>Pay</PrimaryButton></Link></>}</p>

                                </div>
                            </div>

                        </div>
                        <hr className='dark:border-zinc-800' />
                        <div className="flex justify-between items-center">
                        <h1 className=" font-bold">Products</h1>
                        
                        <Link href={route('add.product', order.id)}>
                        <IconPlus/>
                        </Link>
                        </div>
                        <div className="">
                            {order.products.map(product => (
                                <>
                                    <div className=' lg:px-8 transition rounded-md p-2 flex justify-between items-center hover:bg-zinc-900'>
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
                                            {editable && (
                                                <>
                                                    <Link href={route('order-product.edit', product.id)}>
                                                        <IconEdit />
                                                    </Link>
                                                </>
                                            )}

                                        </div>
                                    </div>

                                </>
                            ))}
                        </div>
                        <hr className='dark:border-zinc-800'/>
                        <div className="flex justify-between">
                            <h1 className=" font-bold">Lineup</h1>
                            <Link href={route('lineup.edit', order.id)}>
                                <IconEdit />
                            </Link>
                        </div>
                        <div className='p-2 overflow-x-auto'>
                            <table className='table-auto w-full text-center '>
                                <thead className='text-xs uppercase opacity-50'>
                                    <th>Product</th>
                                    <th>Name</th>
                                    <th>Number</th>
                                    <th>Classification</th>
                                    <th>Gender</th>
                                    <th>Upper Size</th>
                                    <th>Lower Size</th>
                                    <th>Remarks</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    {order.lineups.map(lineup => (
                                        <>
                                            <tr key={lineup.id}>
                                                <td>{lineup.products.product_name}</td>
                                                <td>{lineup.player_name}</td>
                                                <td>{lineup.player_details}</td>
                                                <td>{lineup.classification}</td>
                                                <td>{lineup.gender}</td>
                                                <td>{lineup.upper_size ? lineup.upper_size : 'N/A'}</td>
                                                <td>{lineup.lower_size ? lineup.lower_size : 'N/A'}</td>
                                                <td>{lineup.remarks ? lineup.remarks : 'N/A'}</td>
                                                <td>
                                                    {editable && (

                                                        <>

                                                            </>
                                                    )}
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    {fullscreenImage && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeFullscreen}>
                            <img src={fullscreenImage} alt="Fullscreen" className="max-h-full max-w-full" />
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
