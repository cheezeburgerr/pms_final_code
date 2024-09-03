
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconEdit } from '@tabler/icons-react';
import { Progress } from 'flowbite-react';
import { Card } from 'flowbite-react';

export default function Dashboard({ auth, boxes, order, production, products }) {

    const { props } = usePage();
    console.log(auth.admin)
    return (
        <AdminLayout

            user={auth.admin}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Products</h2>}
        >

            <Head title="Dashboard" />
            {props.flash.success && (
                <>


                    <div className="fixed bottom-10 left-10 rounded-md p-2 z-50 bg-aqua shadow-lg ">
                        <span>{props.flash.success}</span>
                    </div>


                </>
            )}

            <div className="dark:text-gray-100">
                <div className="flex justify-between">
                    <h1 className='text-2xl font-bold mb-8 '>Products</h1>
                    <div>
                        <Link href={route('products.create')}>
                            <PrimaryButton>Add</PrimaryButton>
                        </Link>
                    </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products && products.map(product => (
                        <>
                            <Card className='mb-4 dark:bg-zinc-900 dark:border-zinc-800 shadow-none'>
                                <img src={product.image ? `/images/products/${product.image}` : '/images/placeholder.png'} alt="" className='rounded-md object-cover h-80' />
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className='font-bold'>{product.product_name}</h3>
                                        <p className='text-sm'>{product.product_price}.00</p>
                                    </div>

                                    <Link href={route('products.edit', product.id)} className='flex gap-2 dark:text-white'> <IconEdit color='aqua' /></Link>
                                </div>


                                {/* {product.categories.map(category => (
                                <>
                                    <p>{category.category_name}</p>
                                    {category.variation.map(variation => (
                                        <>
                                            <p>{variation.variation_name}</p>
                                            <p>{variation.variation_price}</p>
                                        </>
                                    ))}
                                </>
                            ))} */}
                            </Card>


                        </>
                    ))}
                </div>
            </div>





        </AdminLayout>
    );
}
