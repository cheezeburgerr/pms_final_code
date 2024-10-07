import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Popover } from "flowbite-react";
import { IconMessage, IconSend } from "@tabler/icons-react";
import TextInput from "../TextInput";
import Message from "./Message";
import moment from "moment";

export default function ChatBox({ user_id }) {
    const [showBox, setShowBox] = useState(false);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatRoom, setChatRoom] = useState(null);

    const scroll = useRef();

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        if (chatRoom) {
            window.Echo.private(`chat.${chatRoom.id}`)
                .listen('MessageSent', (e) => {
                    fetchMessages();
                });

            return () => {
                window.Echo.leaveChannel(`chat.${chatRoom.id}`);
            };
        }
    }, [chatRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/chat/${user_id}`);
            setMessages(response.data.messages);
            setChatRoom(response.data.chatRoom);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error.response ? error.response.data : error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("message", message);
        if (chatRoom) {
            formData.append("chat_room_id", chatRoom.id);
        }
        if (file) {
            formData.append("file", file);
        }

        axios
            .post("/messages", formData)
            .then((response) => {
                setMessage("");
                setFile(null);
                fetchMessages(); // Refresh messages after sending
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });
    };

    const scrollToBottom = () => {
        if (scroll.current) {
            scroll.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {showBox && (
                <div className="bg-gray-100/90 dark:bg-zinc-900/75 rounded-lg fixed bottom-[120px] md:bottom-0 md:right-[120px] w-full md:w-[400px] backdrop-blur-lg">
                    <ChatContent
                        messages={messages}
                        handleSubmit={handleSubmit}
                        message={message}
                        setMessage={setMessage}
                        file={file}
                        setFile={setFile}
                        scroll={scroll}
                        user_id={user_id}
                    />
                </div>
            )}

            <div className="fixed right-10 bottom-10">
                <div className="bg-aqua p-4 rounded-full cursor-pointer" onClick={() => setShowBox(!showBox)}>
                    <IconMessage />
                </div>
            </div>
        </>
    );
}

// Extracted ChatContent component for cleaner code
const ChatContent = ({ messages, handleSubmit, message, setMessage, file, setFile, scroll, user_id }) => (
    <div className=" dark:text-zinc-200 border rounded-t-lg border-zinc-500/25 shadow-lg">
        <div className="bg-aqua p-3 rounded-t-lg"><h1 className="font-bold text-xl text-zinc-800">Chat Box</h1></div>
        <div className="p-4 chat-box overflow-y-auto h-[calc(100vh-300px)] md:h-[500px] no-scrollbar">
            {messages && messages.map((msg, index) => (
                <Message key={msg.id} message={msg} user_id={user_id} previousMessage={messages[index - 1]} />
            ))}
            <span ref={scroll}></span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center p-3">
            <TextInput
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className={'w-full'}
            />

            <button type="submit" className="bg-aqua p-2 rounded-full">
                <IconSend />
            </button>
        </form>
    </div>
);


