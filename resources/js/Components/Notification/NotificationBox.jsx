import { useEffect, useState } from "react";
import Notification from "./Notification";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";
import { IconBell } from "@tabler/icons-react";
import { Button, Popover, Spinner } from "flowbite-react";

export default function NotificationBox({ className = '', user_id, ...props }) {
    const [notifications, setNotifications] = useState([]);
    const { props: { csrf_token } } = usePage(); // Assuming you're using Inertia.js and have CSRF token available in props

    const webSocketChannel = `notifications_channel`;

    const connectWebSocket = () => {
        window.Echo.channel(webSocketChannel)
            .listen('GotNotif', async (e) => {
                await fetchNotifications();
            });
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`/api/fetch_notifications/${user_id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
        }
    };

    const hasUnreadNotifications = () => {
        return notifications.some(notification => notification.status === 'unread');
    };

    const handleNotificationClick = async (notif) => {
        if (notif.status === 'unread') {
            try {
                await axios.put(`/api/update_notification_status/${notif.id}`, {
                    status: 'read'
                }, {
                    headers: {
                        'X-CSRF-TOKEN': csrf_token
                    }
                });
                setNotifications(prevNotifications =>
                    prevNotifications.map(n =>
                        n.id === notif.id ? { ...n, status: 'read' } : n
                    )
                );
            } catch (error) {
                console.error('Error updating notification status:', error.response ? error.response.data : error.message);
            }
        }
        router.visit(notif.url);
    };

    useEffect(() => {
        connectWebSocket();
        fetchNotifications();
    }, []);

    return (
        <>
            <Popover content={
                <div className="p-4 dark:bg-zinc-900  h-[calc(100vh-300px)] overflow-y-auto">
                    <h1 className="font-bold text-xl mb-4">Notifications</h1>
                    <div className="flex flex-col gap-4">
                        {notifications.length > 0 ? notifications.map((notif, index) => (
                            <div className='cursor-pointer' key={index} onClick={() => handleNotificationClick(notif)}>
                                <Notification title={notif.title} message={notif.message} status={notif.status} />
                            </div>
                        )) : <div className="w-full h-full text-center">
                            {/* <Spinner /> */}
                            <p>No notifications.</p>
                            </div>}
                    </div>
                </div>
            }>
                <div className="relative">
                    <Button color={'transparent'}><IconBell /></Button>
                    {hasUnreadNotifications() && <><div className="absolute top-1 right-3 p-2 z-50 bg-red-500 rounded-full text-sm"></div><div className="animate-ping absolute top-1 right-3 p-2 z-50 bg-red-500 rounded-full text-sm"></div></>}
                </div>
            </Popover>
        </>
    );
}
