
import PrimaryButton from "@/Components/PrimaryButton";
import Admin from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";


export default function SizeCharts({ auth, sizeCharts }) {
    // const handleClick = (filename) => {
    //     router.get(route('products.sizeChart', filename));
    // };

    return (
        <Admin user={auth.admin}>
            <div className="flex justify-between mb-4">
                <h1 className="font-bold text-2xl">Size Charts</h1>
                <Link href={route('size-chart.create')}>
                <PrimaryButton>
                    Add
                </PrimaryButton>
                </Link>
            </div>
            <div>
                <ul>
                    {sizeCharts.map((chart, index) => (
                        <Link href={route('products.sizeChart', chart.filename)}>
                        <li key={index}  className="cursor-pointer mb-2 p-4 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 bg-gray-100 border-gray-300 shadow-sm">
                            <p
                                
                                className="text-blue-500 hover:underline"
                            >
                                {chart.filename}
                            </p>
                        </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </Admin>
    );
}
