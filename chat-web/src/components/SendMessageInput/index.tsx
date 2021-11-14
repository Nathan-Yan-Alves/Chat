import { AiOutlineSend } from "react-icons/ai";
import React, { useContext, useState } from "react";
import { api } from "../../services/api";
import { AuthContext } from "../../context/auth";
import styles from "./styles.module.scss";

export function SendMessageInput() {
	const [characterCount, setCharacterCount] = useState(0);
	const [message, setMessage] = useState("");

	const { user } = useContext(AuthContext);
	let borderColorClass = styles.error;
	if (characterCount > 0) {
		borderColorClass = styles.success;
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (characterCount == 0) {
			alert("Campo de texto vazio, digite uma mensagem");
			return;
		}

		const username = user?.username;
		const avatarUrl = user?.avatarUrl;

		await api.post("/messages/new", { username, avatarUrl, text: message });

		setMessage("");
		setCharacterCount(0);
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className={styles.messageContainer}
		>
			<input
				type="text"
				name="messageField"
				className={`${borderColorClass} ${styles.messageField}`}
				value={message}
				onChange={(e) => {
					setCharacterCount(e.target.value.length);
					setMessage(e.target.value);
				}}
			/>
			<button
				type="submit"
				className={`${borderColorClass} ${styles.btnSendMessage}`}
			>
				<AiOutlineSend size="18px" />
				<span>Enviar</span>
			</button>
		</form>
	);
}
