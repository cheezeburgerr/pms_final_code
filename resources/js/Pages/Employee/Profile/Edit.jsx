import Authenticated from "@/Layouts/AuthenticatedLayout";
import EmployeeLayout from "@/Layouts/EmployeeLayout";

export default function Edit ({auth}) {

    return (
        <EmployeeLayout user={auth.employee} >
            <div className="flex justify-between">
                <h1 className="font-bold text-2xl">Edit Profile</h1>
            </div>
            <div></div>
        </EmployeeLayout>
    )
}