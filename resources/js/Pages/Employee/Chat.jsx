import React, { useState, useEffect, useRef } from 'react';
import Echo from 'laravel-echo';
import axios from 'axios';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Card } from 'flowbite-react';
import TextInput from '@/Components/TextInput';
import { IconPaperclip, IconSearch, IconSend, IconX } from '@tabler/icons-react';
import Message from '@/Components/ChatBox/Message';
import classNames from 'classnames';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link } from '@inertiajs/react';

const Chat = ({ auth, users, orders }) => {
    const [currentMessages, setCurrentMessages] = useState();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
    const [file, setFile] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [chats, setChats] = useState(auth.employee.dept_id == 2 ? 'Users' : 'Orders');
    const [ordersChat, setOrderChat] = useState(orders.filter(order => order.employees.some(e => e.user_id === auth.employee.id)))

    const scroll = useRef();

    useEffect(() => {
        if (chatRoom) {
            window.Echo.private(`chat.${chatRoom.id}`)
                .listen('MessageSent', (e) => {
                    fetchMessages(chatRoom.user_id);
                });

            return () => {
                window.Echo.leaveChannel(`chat.${chatRoom.id}`);
            };
        }
    }, [chatRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async (user_id) => {
        try {
            const response = await axios.get(`/api/chat/${user_id}`);
            setMessages(response.data.messages);
            setChatRoom(response.data.chatRoom);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error.response ? error.response.data : error.message);
        }
    };

    const fetchOrderMessages = async (order_id) => {
        try {
            const response = await axios.get(`/api/order-chat/${order_id}`);
            setMessages(response.data.messages);
            setChatRoom(response.data.chatRoom);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error.response ? error.response.data : error.message);
        }
    };


    const scrollToBottom = () => {
        if (scroll.current) {
            scroll.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user_id', auth.employee.id);
        formData.append('message', message);
        formData.append('chat_room_id', chatRoom.id);
        if (file) {
            file.forEach(f => formData.append('file[]', f));
        }


        axios.post('/messages', formData).then((response) => {
            const newMessage = {
                id: response.data.id,
                user: response.data.user,
                message: response.data.message,
                file_path: response.data.file,
            };

            console.log(file)
            setMessage('');
            setFile(null);
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    console.log(orders)
    const filteredOrders = ordersChat.filter(order =>
        order.team_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // console.log(filteredUsers);

    return (
        <EmployeeLayout user={auth.employee}>
            <div className="flex gap-4 items-start h-[calc(100vh-103px)]">
                <div className={'rounded-lg p-4 border bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 shadow-none  gap-4 w-full h-full m-0'}>
                    <div className="flex gap-4">
                        <div className="w-1/4 xl:w-1/3">

                            <div className="mb-4 relative">
                                <TextInput
                                    placeholder="Search Customer"
                                    className="w-full pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <IconSearch />
                                </div>
                            </div>
                            {auth.employee.dept_id == 2 && (
                                <>
                                    <div className="flex gap-4 w-100 mb-4">
                                <p className={`p-1 rounded-lg w-full text-center cursor-pointer ${chats == 'Users' ? 'bg-aqua font-bold text-gray-900' : ''}`} onClick={() => setChats('Users')}>Users</p>
                                <p className={`p-1 rounded-lg w-full text-center cursor-pointer ${chats == 'Orders' ? 'bg-aqua font-bold text-gray-900' : ''}`} onClick={() => setChats('Orders')}>Orders</p>
                            </div>
                                </>
                            )}
                            <div className="overflow-y-auto h-[calc(100%-50px)] no-scrollbar">

                                        {chats == 'Users' && (
                                    <>
                                        {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className={classNames('p-2 rounded-lg flex gap-4 items-center cursor-pointer', {
                                            'bg-teal-100 dark:bg-aqua/25': chatRoom && user.id === chatRoom.user.id
                                        })}
                                        onClick={() => fetchMessages(user.id)}
                                    >
                                        <img
                                            src={`/images/customers/${user.image != null ? user.image : 'profile.jpg'}`}
                                            alt=""
                                            className='h-10 rounded-full'
                                        />
                                        <div>
                                            <p className="font-bold text-ellipsis truncate">{user.name}</p>
                                            {user.chatroom && user.chatroom.lastmessage && (
                                                <p className='text-sm text-gray-500'>{user.chatroom.lastmessage.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                    </>
                                )}

                                {chats == 'Orders' && (
                                    <>
                                    {filteredOrders.map(order => (
                                    <div
                                        key={order.id}
                                        className={classNames('p-2 rounded-lg flex gap-4 items-center cursor-pointer', {
                                            'bg-teal-100 dark:bg-aqua/25': ''
                                        })}
                                        onClick={() => fetchOrderMessages(order.id)}
                                    >
                                        <img
                                            src={`/images/customers/${order.image != null ? order.image : 'profile.jpg'}`}
                                            alt=""
                                            className='h-10 rounded-full'
                                        />
                                        <div>
                                            <p className="font-bold text-ellipsis truncate">{order.team_name}</p>
                                            {order.chatroom && order.chatroom.lastmessage && (
                                                <p className='text-sm text-gray-500'>{order.chatroom.lastmessage.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-full">
                            <ChatContent
                            chatRoom={chatRoom && chatRoom}
                                messages={messages}
                                order={chatRoom && (chatRoom.type === 'Order' && chatRoom.order.latestapproved)}
                                handleSubmit={handleSubmit}
                                message={message}
                                setMessage={setMessage}
                                file={file}
                                setFile={setFile}
                                scroll={scroll}
                                user_id={auth.employee.id}
                            />
                        </div>
                    </div>
                </div>

                <Card className={'bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 shadow-none w-1/4 h-full '}>
                    {chatRoom && (
                        <div className="flex flex-col items-center h-full pt-4">
                            <img
                                src={`/images/customers/${chatRoom.user.image != null ? chatRoom.user.image : 'profile.jpg'}`}
                                alt=""
                                className='h-20 rounded-full mb-4 '
                            />
                            <h1 className='font-bold text-xl'>{chatRoom.name}</h1>
                        </div>
                    )}
                </Card>
            </div>
        </EmployeeLayout>
    );
};

export default Chat;


const ChatContent = ({ chatRoom, messages, handleSubmit, message, setMessage, file, setFile, scroll, user_id, order }) => {
    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        setFile([...file, ...Array.from(e.target.files)]);
    };

    const handleRemoveFile = (index) => {
        setFile(file.filter((_, i) => i !== index));
    };

    return (
        <div className="p-2 dark:text-zinc-100">
            <h1 className="font-bold text-xl mb-4">{chatRoom ? chatRoom.name : 'Chat Box'}</h1>
            <div className="relative">
                {order && (
                <>
                    <Card className='absolute inset-x-0 animate-pulse bg-gradient-to-r from-aqua to-purple-500 dark:border-zinc-800 mb-4'>
                        <div className="w-full flex gap-4 justify-between">
                            <div>
                                <p className="font-extrabold text-xl text-zinc-900">Waiting for Approval</p>
                                <p className='text-zinc-900'>We are waiting for the client to check the design.</p>
                            </div>
                            {/* <div>
                                <Link href={route('orders.approval', chatRoom.order.id)}>
                                    <SecondaryButton>
                                        Check
                                    </SecondaryButton>
                                </Link>
                            </div> */}
                        </div>
                    </Card>
                </>
            )}
            </div>
            <div className="chat-box overflow-y-auto h-[calc(100vh-250px)] no-scrollbar py-4">
                {messages && messages.map((msg, index) => (
                    <>
                        <Message key={msg.id} message={msg} user_id={user_id} previousMessage={messages[index - 1]} />

                    </>
                ))}
                <span ref={scroll}></span>
            </div>
            <div className="p-2 dark:bg-zinc-800 rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        {file && file.map((f, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(f)}
                                    alt="uploaded preview"
                                    className="h-20 w-20 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                                >
                                    <IconX />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 items-center">
                        <button type="button" onClick={handleFileClick} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <IconPaperclip />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            style={{ display: 'none' }}
                        />
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                            className="w-full dark:bg-zinc-800 border-0"
                        />
                        <button type="submit" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <IconSend />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


