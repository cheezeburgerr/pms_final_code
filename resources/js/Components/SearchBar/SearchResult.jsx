import { Popover } from "flowbite-react";
import TextInput from "../TextInput";
import { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import moment from "moment";
import { Link } from "@inertiajs/react";
import { getStatusColor } from "@/statusColors";

export default function SearchResult({ className = '', title, due_date, status, url, ...props }) {


    return (
        <Link href={url}>
            <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <h1 className="font-bold">{title}</h1><p className={`${getStatusColor(status)}`}>{status}</p>
                </div>

            <p>{moment(due_date).format('MMMM Do YYYY')}</p>

        </div>
        </Link>
    );
}
