import PrimaryButton from '@/Components/PrimaryButton';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import ModelViewer from './ModelViewer'; // Import the ModelViewer component


export default function Models({ auth, models }) {
    const { props } = usePage();
    return (
        <EmployeeLayout
            user={auth.employee}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Models</h2>}
        >
            <Head title="Models" />

            <div className="flex justify-between">
                <h1 className='text-2xl font-bold mb-8'>Models</h1>
                <Link href={route('models.create')}>
                    <PrimaryButton>Add</PrimaryButton>
                </Link>
            </div>
            <div className="dark:text-gray-100 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {models && models.map(model => (
                    <Link href={route('models.edit', model.id)}>
                        <div key={model.id} className="mb-8 rounded-lg dark:bg-zinc-900 p-6 dark:border-zinc-800 bg-gray-100">

                            <ModelViewer path={`/storage/models/${model.path}`} /> {/* Display the 3D model */}
                            <h3 className="text-lg font-bold">{model.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </EmployeeLayout>
    );
}


