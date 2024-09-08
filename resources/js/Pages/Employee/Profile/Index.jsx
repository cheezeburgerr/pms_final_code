import ProfileInfo from "@/Components/ProfileInfo";
import EmployeeLayout from "@/Layouts/EmployeeLayout";

export default function Profile({auth})
{
    return(
        <EmployeeLayout user={auth.employee}>

            <ProfileInfo user={auth.employee}/>
        </EmployeeLayout>
    )
}