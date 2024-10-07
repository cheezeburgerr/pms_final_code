import React, { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { IconX } from '@tabler/icons-react';
import { Card, Tabs } from 'flowbite-react';



export default function LineupForm({ data, setData, prevStep, products }) {
    data.lineups = data.lineups || [];
    
    // Initialize rows with 12 empty rows
    const initialRows = Array.from({ length: 2 }, (_, index) => ({ id: index }));
    const [rows, setRows] = useState(data.lineups.length > 0 ? data.lineups : initialRows);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // State to manage active tab
    const [sizeCharts, setSizeCharts] = useState([]);

    useEffect(() => {
        // Fetch size chart data from the backend
        fetch('/api/size-charts') // Update with your actual endpoint
            .then(response => response.json())
            .then(data => setSizeCharts(data))
            .catch(error => console.error('Error fetching size charts:', error));
    }, []);


    
    const addRow = () => {
        setRows(prevRows => [...prevRows, { id: prevRows.length }]);
    };

    const removeRow = (id) => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
    };

    useEffect(() => {
        setData('lineups', rows);
    }, [rows]);

    const handleInputChange = (rowId, field, value) => {
        setRows(prevRows =>
            prevRows.map(row => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        [field]: value
                    };
                }
                return row;
            })
        );

        setData(prevData => ({
            ...prevData,
            lineups: prevData.lineups.map(row => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        [field]: value
                    };
                }
                return row;
            })
        }));
    };


    

    console.log(data.products);
    const getProductPrice = (productId) => {
        console.log(productId);
        const product = data.products.find(product => product.id == productId);
        console.log(product);
        return product ? product.subtotal : 0;
    };

    return (
        <div>
            <div className="flex justify-between">
                <h2 className='mb-6'>Add Lineup</h2>
                <SecondaryButton className='h-8' onClick={() => setShowSizeChart(!showSizeChart)}>Size Chart</SecondaryButton>
            </div>
            {showSizeChart && (
                // <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4">
                //     <h1>Size Chart</h1>
                //     <Tabs aria-label="Full width tabs" style="fullWidth">
                //         <Tabs.Item active title="Adult Jersey">
                //             <img src="/images/products/size-charts/adult-jersey.jpg" alt="jersey size chart" />
                //         </Tabs.Item>
                //         <Tabs.Item title="Kids Jersey">
                //             <img src="/images/products/size-charts/kids-jersey.jpg" alt=" kids jersey size chart" />
                //         </Tabs.Item>
                //         <Tabs.Item title="Tshirt">
                //             <img src="/images/products/size-charts/adult-jersey.jpg" alt="jersey size chart" />
                //         </Tabs.Item>
                //         <Tabs.Item title="Polo">
                //             <img src="/images/products/size-charts/polo.jpg" alt="polo size chart" />
                //         </Tabs.Item>
                //     </Tabs>
                // </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4">
                <h1 className="font-bold text-2xl mb-4">Size Charts</h1>
                <Card>
                <Tabs aria-label="Full width tabs" style="fullWidth" onActiveTabChange={setActiveTab} className='bg-white dark:bg-zinc-900'>
                        {sizeCharts.map((chart, index) => (
                            <Tabs.Item key={index} active={index === activeTab} title={chart.filename.replace('.xml', '')}>
                                <table className="min-w-full divide-y divide-gray-300 bg-gray-200 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-900">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                            {chart.data.Sizes.Size[0]?.Measurements && Object.keys(chart.data.Sizes.Size[0].Measurements).map((measurement) => (
                                                <th key={measurement} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{measurement}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-100 dark:bg-zinc-900 divide-y divide-gray-200">
                                        {chart.data.Sizes.Size.map((size) => (
                                            <tr key={size.Name}>
                                                <td className="px-6 py-4 whitespace-nowrap">{size.Name}</td>
                                                {Object.values(size.Measurements).map((value, index) => (
                                                    <td key={index} className="px-6 py-4 whitespace-nowrap">{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Tabs.Item>
                        ))}
                    </Tabs>
                </Card>
            </div>
            )}
            <form className="relative overflow-x-auto sm:rounded-lg">
                <div className="mb-3 sticky top-15 bg-light p-3">
                    <div className="row">
                        <div className="flex justify-between">
                            <div></div>
                            <div className="flex items-center space-x-2">
                                <SecondaryButton onClick={addRow} className="btn btn-dark btn-sm">Add Row</SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row scrollable card p-3">
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
                            {rows.map(row => {
                                const productPrice = getProductPrice(row.product);
                                console.log(productPrice);
                                const adjustedPrice = row.classification === 'Kid' ? productPrice - 50 : productPrice;

                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <select className="w-full md:w-36 border-zinc-800 rounded-md dark:bg-zinc-900" value={row.product} onChange={e => handleInputChange(row.id, 'product', e.target.value)} required>
                                                <option value="" disabled selected required>Select Product</option>
                                                {data.products.map(product => (
                                                    <option key={product.id} value={product.id}>{product.product_name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td><TextInput className="w-60" type="text" value={row.player_name} onChange={e => handleInputChange(row.id, 'player_name', e.target.value)} placeholder="Name" required /></td>
                                        <td><TextInput className="w-full md:w-36" type="text" value={row.player_details} onChange={e => handleInputChange(row.id, 'player_details', e.target.value)} placeholder="Number" /></td>
                                        <td>
                                            <select className="w-full md:w-36 border-zinc-800 rounded-md dark:bg-zinc-900" value={row.classification} onChange={e => handleInputChange(row.id, 'classification', e.target.value)} required>
                                                <option value="" disabled selected>Select Classification</option>
                                                <option value="Adult">Adult</option>
                                                <option value="Kid">Kid</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select className="w-full md:w-24 border-zinc-800 rounded-md dark:bg-zinc-900" value={row.gender} onChange={e => handleInputChange(row.id, 'gender', e.target.value)} required>
                                                <option value="" disabled selected>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select className="w-20 border-zinc-800 rounded-md dark:bg-zinc-900" value={row.upper_size} onChange={e => handleInputChange(row.id, 'upper_size', e.target.value)} required>
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
                                            <select className="w-20 border-zinc-800 rounded-md dark:bg-zinc-900" value={row.lower_size} onChange={e => handleInputChange(row.id, 'lower_size', e.target.value)} required>
                                                <option value="" disabled selected>Select Size</option>
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </td>
                                        <td><TextInput className="w-full md:w-36" type="text" value={row.remarks} onChange={e => handleInputChange(row.id, 'remarks', e.target.value)} placeholder="" /></td>
                                        <td>{adjustedPrice}</td>
                                        <td><IconX onClick={() => removeRow(row.id)} className='cursor-pointer'/></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    );
}
