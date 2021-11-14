import { SendMessageInput } from "./components/SendMessageInput";
import styles from "./App.module.scss";
import { MessageList } from "./components/MessageList";
import { Login } from "./components/Login";
import { AuthContext } from "./context/auth";
import React, { useContext } from "react";
import { Header } from "./components/Header";

function App() {
	const { signed } = useContext(AuthContext);

	return (
		<div className={styles.container}>
			<Header />
			{signed ? (
				<>
					<MessageList />
					<SendMessageInput />
				</>
			) : (
				<Login />
			)}
		</div>
	);
}

export default App;
