import ProfileInfo from "@/Components/ProfileInfo";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import { getStatusColor } from "@/statusColors";
import { Card } from "flowbite-react";

export default function Profile({ auth, employee }) {
    return (
        <EmployeeLayout user={auth.employee}>

            <div className="mb-4">
                <ProfileInfo user={auth.employee} />
            </div>
            <div className="lg:flex gap-4">
                {employee && (
                    <>
                        <Card className="dark:border-zinc-800 dark:bg-zinc-800 shadow-sm w-1/3">
                            {employee.duties.map(duty => (
                                <>
                                    <div className="flex justify-between items-center">
                                        <p>{duty.orders.team_name}</p>
                                        <p className={`${getStatusColor(duty.orders.production.status)}`}>{duty.orders.production.status}</p>
                                    </div>
                                </>
                            ))}
                        </Card>
                    </>
                )}
            </div>
        </EmployeeLayout>
    )
}