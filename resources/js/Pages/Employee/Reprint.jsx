
import KanbanBoard from '@/Components/KanbanBoard/KanbanBoard';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head, usePage } from '@inertiajs/react';
import { Progress } from 'flowbite-react';
import PrintQueue from '@/Components/PrintQueue';
import PrintTable from '@/Components/PrintTable';
import ReprintTable from '@/Components/ReprintTable';
import BackButton from '@/Components/BackButton';


export default function Reprint({ auth, boxes, order, printers }) {


    return (
        <EmployeeLayout

            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >

            <Head title="Dashboard" />

<BackButton/>
           <h1 className='text-2xl font-bold mb-8 '>Reprint</h1>
           <div className="dark:text-gray-100">
            <ReprintTable order={order}/>
            </div>








        </EmployeeLayout>
    );
}
