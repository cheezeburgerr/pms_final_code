import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { IconX } from '@tabler/icons-react';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function EditLineup({ auth, lineup, order }) {
    const [lineupData, setLineupData] = useState(lineup); // State to manage lineup data locally

    // Function to add a new row to lineupData
    const addRow = () => {
        setLineupData([...lineupData, {

            order_id: order.id,
            product_id: null,
            player_name: '',
            player_details: '',
            classification: '',
            gender: '',
            upper_size: '',
            lower_size: '',
            remarks: '',
            price: ''
        }]);

        console.log(lineupData)
    };

    console.log(lineupData)
    // Function to remove a row from lineupData
    const removeRow = (id) => {
        setLineupData(lineupData.filter(row => row.id !== id));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit lineupData to Laravel backend using Inertia.js
        router.put(route('lineup_update'), {
            lineup: lineupData,
            order_id: order.id
        });
    };

    // Function to handle product change
    const handleProductChange = (index, product_id) => {
        const selectedProduct = order.products.find(product => product.products[0].id == parseInt(product_id));
        const productPrice = selectedProduct ? selectedProduct.subtotal : '';

        setLineupData(prev => (
            prev.map((row, i) => (
                i === index ? { ...row, product_id: parseInt(product_id), price: parseInt(productPrice) } : row
            ))
        ));
    };

    // Function to handle classification change
    const handleClassificationChange = (index, classification) => {
        setLineupData(prev => (
            prev.map((row, i) => {
                if (i === index) {
                    const productPrice = order.products.find(product => product.products[0].id == row.product_id)?.subtotal || '';
                    const newPrice = classification === 'Kid' ? productPrice - 50 : productPrice;
                    return { ...row, classification, price: newPrice };
                }
                return row;
            })
        ));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Lineup</h2>}
        >
            <Head title="Edit Lineup" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 dark:text-gray-100">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl">Edit Lineup</h1>
                        <SecondaryButton type="button" onClick={addRow}>Add Row</SecondaryButton>
                    </div>
                    <div className="overflow-x-auto row scrollable card p-3">
                        <form onSubmit={handleSubmit}>
                            <table className="w-full text-sm text-left rtl:text-right text-zinc-500">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Number/Position</th>
                                        <th>Classification</th>
                                        <th>Gender</th>
                                        <th>Upper Size</th>
                                        <th>Lower Size</th>
                                        <th>Note/Remarks</th>
                                        <th>Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineupData.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <select
                                                    className="w-full md:w-36 border-zinc-800 rounded-md dark:bg-zinc-900"
                                                    value={row.product_id}
                                                    onChange={(e) => handleProductChange(index, e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled selected>Select Product</option>
                                                    {order.products.map(product => (
                                                        <option key={product.products[0].id} value={product.products[0].id}>{product.products[0].product_name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td><TextInput className="w-60" type="text" value={row.player_name} onChange={(e) => {
                                                const value = e.target.value;
                                                setLineupData(prev => (
                                                    prev.map((r, i) => (i === index ? { ...r, player_name: value } : r))
                                                ));
                                            }} placeholder="Name" required /></td>
                                            <td><TextInput className="w-full md:w-36" type="text" value={row.player_details} onChange={(e) => {
                                                const value = e.target.value;
                                                setLineupData(prev => (
                                                    prev.map((r, i) => (i === index ? { ...r, player_details: value } : r))
                                                ));
                                            }} placeholder="Number" /></td>
                                            <td>
                                                <select
                                                    className="w-full md:w-36 border-zinc-800 rounded-md dark:bg-zinc-900"
                                                    value={row.classification}
                                                    onChange={(e) => handleClassificationChange(index, e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled selected>Select Classification</option>
                                                    <option value="Adult">Adult</option>
                                                    <option value="Kid">Kid</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="w-full md:w-24 border-zinc-800 rounded-md dark:bg-zinc-900"
                                                    value={row.gender}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setLineupData(prev => (
                                                            prev.map((r, i) => (i === index ? { ...r, gender: value } : r))
                                                        ));
                                                    }}
                                                    required
                                                >
                                                    <option value="" disabled selected>Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="w-20 border-zinc-800 rounded-md dark:bg-zinc-900"
                                                    value={row.upper_size}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setLineupData(prev => (
                                                            prev.map((r, i) => (i === index ? { ...r, upper_size: value } : r))
                                                        ));
                                                    }}
                                                    required
                                                >
                                                    <option value="" disabled selected>Select Size</option>
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="w-20 border-zinc-800 rounded-md dark:bg-zinc-900"
                                                    value={row.lower_size}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setLineupData(prev => (
                                                            prev.map((r, i) => (i === index ? { ...r, lower_size: value } : r))
                                                        ));
                                                    }}
                                                    required
                                                >
                                                    <option value="" disabled selected>Select Size</option>
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                            </td>
                                            <td><TextInput className="w-full md:w-36" type="text" value={row.remarks} onChange={(e) => {
                                                const value = e.target.value;
                                                setLineupData(prev => (
                                                    prev.map((r, i) => (i === index ? { ...r, remarks: value } : r))
                                                ));
                                            }} placeholder="" /></td>
                                            <td><p id='price-details'>{row.price}</p></td>
                                            <td><IconX onClick={() => removeRow(row.id)} className='cursor-pointer' /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-end">

                                <PrimaryButton type="submit" className="ml-2">Save Changes</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
