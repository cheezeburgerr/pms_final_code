import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { IconArrowDown } from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import { Card, Toast } from 'flowbite-react';
import ProductCarousel from '@/Components/ProductCarousel';
import "react-multi-carousel/lib/styles.css";

export default function Dashboard({ auth, products, designs }) {

    const { props } = usePage();
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="TJM Sportswear" />

            {props.flash.success && (
                <div className="fixed bottom-10 left-10 z-50">
                    <Toast>
                        <span>{props.flash.success}</span>
                        <Toast.Toggle />
                    </Toast>
                </div>
            )}
            <div className='p-4 h-60 lg:h-48 py-12 dark:text-gray-100 text-center'>
                <h1 className='text-5xl md:text-6xl lg:text-8xl tracking-tight font-black uppercase '>Sweat it with Style</h1>
                <p className='text-xl mt-4'>This is TJM Sportswear. Your number one sportswear apparel buddy</p>
                <Link href={route('orders.index')}><PrimaryButton className='mt-4'>Order Now</PrimaryButton></Link>
            </div>
            <div className="py-12">
                <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="">
                        <img src="images\longsleeve.png" alt="" />

                    </div>
                    <div className="hidden md:block animate-bounce absolute inset-x-0 bottom-20 text-center ">

                        <div className="flex justify-center">
                            <div className="bg-zinc-900 text-gray-200 dark:bg-gray-100 dark:text-gray-900 rounded-full p-3"><IconArrowDown /></div>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 text-center mb-16'>
                        <div className=' border-r-2'><h1 className='text-lg font-bold uppercase text-gray-800 dark:text-gray-100'>High Quality</h1></div>
                        <div className='border-r-2'><h1 className='text-lg font-bold uppercase text-gray-800 dark:text-gray-100'>Full Sublimation</h1></div>
                        <div><h1 className='text-lg font-bold uppercase text-gray-800 dark:text-gray-100'>Vibrant Apparels</h1></div>
                    </div>
                    <div className="px-5 flex justify-between items-center mb-2">
                        <h1 className="font-bold text-lg dark:text-gray-100">Products</h1>
                        <p className="text-aqua">Order Now</p>
                    </div>
                    <ProductCarousel>
                        {products.map((product) => (
                            <Link key={product.id} to={`/product/${product.id}`}>
                                <div className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none p-0 mx-2 rounded-b-lg'>
                                    <img src={`/images/products/${product.image}`} alt="" className='rounded-t-lg h-56 object-cover w-full' />
                                    <div className="p-5 ">
                                        <h1 className="font-bold text-xl text-gray-100">{product.product_name}</h1>
                                        <p className='text-aqua'>{product.product_price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </ProductCarousel>
                    <div className="px-5 flex justify-between items-center mb-2 mt-10">
                        <h1 className="font-bold text-lg dark:text-gray-100">Designs</h1>
                        <p className="text-aqua">View All</p>
                    </div>
                    <ProductCarousel>
                        {designs.map((design) => (
                            <Link key={design.id} href={route('designs.show', design.id)}>
                                <div className='dark:bg-zinc-900 dark:border-zinc-800 shadow-none p-0 mx-2 rounded-b-lg'>
                                    <img src={`/storage/${design.image}`} alt="" className='rounded-t-lg h-56 object-cover w-full' />
                                    <div className="p-5 ">
                                        <h1 className="font-bold text-xl text-gray-100">{design.name}</h1>
                                        {/* <p className='text-aqua'>{product.product_price.toFixed(2)}</p> */}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </ProductCarousel>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
