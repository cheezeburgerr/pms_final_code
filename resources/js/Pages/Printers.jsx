import { useState } from 'react';
// import { Inertia } from '@inertiajs/inertia';
import { Card } from 'flowbite-react';
import { router } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';

export default function Printers({ auth, printers }) {
    const handleStatusChange = (printerId, newStatus) => {
        router.post(route('printer_update', printerId), { status: newStatus });
    };

    return (
        <EmployeeLayout
            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Printers</h2>}
        >
            <h1 className='text-2xl font-bold mb-8'>Printers</h1>
            <div className="dark:text-gray-100">
                <div className="space-y-4">
                    <div className="grid grid-cols-4">
                        <p>Equipment</p>
                        <p>Type</p>
                        <p>Status</p>
                    </div>
                    {printers.map(printer => (
                        <Card key={printer.id} className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
                            <div className="grid grid-cols-4">
                                <p>{printer.equipment_name}</p>
                                <p>{printer.type}</p>
                                <select
                                    value={printer.status}
                                    onChange={(e) => handleStatusChange(printer.id, e.target.value)}
                                    className='border-zinc-300 shadow-sm dark:border-zinc-700 rounded-md dark:bg-zinc-800 text-sm'
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </EmployeeLayout>
    );
}
