import { Popover } from "flowbite-react";
import TextInput from "../TextInput";
import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Ensure axios is imported
import SearchResult from "./SearchResult";
import { IconSearch } from "@tabler/icons-react";

export default function SearchBox({ className = '', message, title, ...props }) {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchToggle, setSearchToggle] = useState(false);
    const searchBoxRef = useRef(null);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setHasSearched(true);
        fetchOrders(term);
    }

    const fetchOrders = async (term) => {
        try {
            const response = await axios.get(`/api/fetch_orders/${term}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setSearch(false);
            }
        };

        if (search) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [search]);

    return (
        <div ref={searchBoxRef} className={className}>
            <div className="hidden md:block">
            <TextInput placeholder={"Search"} onChange={handleSearch} onClick={() => setSearch(true)} />
            {search && (
                <div className="p-4 bg-gray-200 shadow-lg dark:bg-zinc-900 w-[500px] absolute rounded-lg mt-4 flex flex-col gap-4">
                    {!hasSearched ? (
                        <p>Please search an order</p>
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <SearchResult
                                key={order.id}
                                title={order.team_name}
                                due_date={order.due_date}
                                status={order.production.status}
                                url={`/employee/view-order/${order.id}`}
                            />
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
            )}
            </div>
            <div className="md:hidden">
            <IconSearch onClick={() => setSearchToggle(!searchToggle)}/>
            {searchToggle && (
                <>
             <div className="fixed inset-x-0 top-20 p-4 dark:bg-zinc-950 rounded-lg">
             <TextInput placeholder={"Search"} onChange={handleSearch} onClick={() => setSearch(true)} />
            {search && (
                <div className="p-4 bg-gray-200 shadow-lg dark:bg-zinc-900 w-full md:w-[500px] absolute rounded-lg mt-4 flex flex-col gap-4">
                    {!hasSearched ? (
                        <p>Please search an order</p>
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <SearchResult
                                key={order.id}
                                title={order.team_name}
                                due_date={order.due_date}
                                status={order.production.status}
                                url={`/employee/view-order/${order.id}`}
                            />
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
            )}
             </div>
                </>
            )}
            </div>
        </div>
    );
}
