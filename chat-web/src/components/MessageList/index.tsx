import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/auth";
import { api } from "../../services/api";
import io from "socket.io-client";
import useSound from "use-sound";
import styles from "./styles.module.scss";
import messageSfx from "../../assets/messageSound.mp3";

interface IMessage {
    _id: string;
    username: string;
    avatarUrl: string;
    text: string;
    createdAt: string;
}

const messagesQueue: IMessage[] = [];
const socket = io("http://localhost:8080");

socket.on("new_messages", (newMessage: IMessage) => {
	messagesQueue.push(newMessage);
});

export function MessageList() {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const { user } = useContext(AuthContext);

	const [playSound] = useSound(messageSfx, { volume: 0.5 });

	const containerElement = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		containerElement.current?.scrollTo(
			0,
			containerElement.current.scrollHeight
		);

		playSound();
	}, [messages]);

	useEffect(() => {
		api.get("/messages/all").then((res) => {
			setMessages(res.data);
		});
	}, []);

	useEffect(() => {
		setInterval(() => {
			if (messagesQueue.length > 0) {
				setMessages((prevState) => [...prevState, messagesQueue[0]]);
				messagesQueue.shift();
			}
		}, 1000);
	}, []);

	return (
		<div className={styles.messageContainer} ref={containerElement}>
			{messages.map((message) => {
				let isUserMessage = false;
				if (message.username == user?.username) {
					isUserMessage = true;
				}
				return (
					<div
						className={`${styles.messageWrapper} ${
							isUserMessage
								? styles.userMessageStyle
								: styles.defaultMessageStyle
						}`}
						key={message._id}
					>
						{!isUserMessage ? (
							<>
								<div className={styles.messageHeader}>
									<div className={styles.userImage}>
										<img
											src={message.avatarUrl}
											alt={message.username}
										/>
									</div>
									<span className={styles.userName}>
										{message.username}
									</span>
								</div>
								<hr className={styles.divisionLine} />
							</>
						) : null}
						<div className={styles.messageContent}>
							{message.text}
						</div>
						<hr className={styles.divisionLine} />
						<div className={styles.messageFooter}>
							<span className={styles.timeSent}>09:00</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
