export default function Notification({ className = '', message, title, status, ...props }) {
    return (
        <>
            <div className={`p-4 ${status === 'unread' ? 'border border-aqua bg-aqua bg-opacity-25' : 'dark:bg-zinc-800'} rounded-lg`}>
                <h1 className="font-bold">{title}</h1>
                <p className="text-sm">{message}</p>
            </div>
        </>
    );
}
