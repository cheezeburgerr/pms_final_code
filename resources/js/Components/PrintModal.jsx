import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';

const PrintModal = ({ orderId, onSubmit, showPrintModal, setShowPrintModal }) => {
    const { data, setData, post, processing, errors } = useForm({
        printer: '', // State to hold selected printer
    });

    const [printers, setPrinters] = useState([]);

    // Simulate fetching printers (replace with actual data fetching logic)
    useEffect(() => {
        fetchPrinters();
    }, []);

    const fetchPrinters = async () => {
        try {
            const response = await axios.get('/api/printers'); // Replace with your API endpoint for fetching printers
            setPrinters(response.data); // Assuming response.data is an array of printer objects
        } catch (error) {
            console.error('Error fetching printers:', error);
        }
    };

    const handlePrinterChange = (e) => {
        const selectedPrinterId = e.target.value;
        setData('printer', selectedPrinterId); // Update the 'printer' state in the form data
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('print.submit', orderId), {
            onSuccess: onSubmit, // Handle success callback
            onError: (errors) => console.log(errors), // Handle error callback
        });
        setShowPrintModal(false)
    };

    return (
        <div className='p-4 dark:text-gray-100'>
            <p>Proceed</p>
            <form onSubmit={handleSubmit}>
                <div className='w-full'>
                <select
                    name='printer'
                    className='border-zinc-300 shadow-sm dark:border-zinc-700 rounded-md dark:bg-zinc-800 w-full mb-3'
                    value={data.printer} // Bind selected value to state
                    onChange={handlePrinterChange} // Handle change event
                >
                    <option value='' disabled>Select</option>
                    {printers.map(printer => (
                        <option key={printer.id} value={printer.id}>
                            {printer.equipment_name}
                        </option>
                    ))}
                </select>
                </div>

                <PrimaryButton type='submit' disabled={processing}>Submit</PrimaryButton>
            </form>
        </div>
    );
};

export default PrintModal;
