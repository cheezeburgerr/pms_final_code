
import KanbanBoard from '@/Components/KanbanBoard/KanbanBoard';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head, usePage } from '@inertiajs/react';
import { Progress, Toast } from 'flowbite-react';
import PrintQueue from '@/Components/PrintQueue';


export default function Dashboard({ auth, boxes, orders, printers, errors }) {

    const { props } = usePage();

    // Determine which component to render based on department_id
    const componentToRender = [1, 2, 4].includes(auth.employee.dept_id)
        ? <KanbanBoard orders={orders} printers={printers} user={auth.employee} />
        : auth.employee.dept_id === 3
            ? <PrintQueue orders={orders} printers={printers} errors={errors} />
            : <div>Department not supported</div>;

    console.log(props);

    return (
        <EmployeeLayout

            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >

            <Head title="Dashboard" />

            {props.flash.success && (
                <>
                    <div
                        className="fixed bottom-10 left-10 z-50 animate-slideUp transition-transform transform 
      animate-[slide-up_0.5s_ease-out_forwards]"
                    >
                        <Toast>
                            <span>{props.flash.success}</span>
                            <Toast.Toggle />
                        </Toast>
                    </div>
                </>
            )}


            <h1 className='text-2xl font-bold mb-2 '>Hello {auth.employee.name}!</h1>
            <div className="dark:text-gray-100 relative">

                {componentToRender}
            </div>








        </EmployeeLayout>
    );
}

