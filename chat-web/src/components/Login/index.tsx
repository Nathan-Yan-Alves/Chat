import styles from "./styles.module.scss";
import { CgEnter } from "react-icons/cg";
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/auth";

export function Login() {
	const [hideOverlay, setHideOverlay] = useState<boolean>();
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);

	const fileInput = useRef<HTMLInputElement>(null);

	const { signIn } = useContext(AuthContext);

	useEffect(() => {
		if (image) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(image);
		} else {
			setPreview(null);
		}
	}, [image]);

	function updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value) {
			setUsername(e.target.value);
		}
	}

	function inputClick() {
		fileInput.current?.click();
	}

	function OverlayAvatar() {
		return (
			<img
				src="/src/assets/camIcon.svg"
				alt="Camera icon"
				className={styles.avatarOverlay}
			/>
		);
	}

	function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
		try {
			const file = event.target.files?.[0];

			if (file && file.type.substr(0, 5) === "image") {
				setImage(file);
			} else {
				setImage(null);
			}
		} catch (err) {
			console.log(err);
		}
	}

	function sendInfo() {
		if (username) {
			if (preview) {
				signIn({ username, avatarUrl: preview });
			} else {
				signIn({ username, avatarUrl: "default" });
			}
		}
	}

	return (
		<div className={styles.loginWrapper}>
			<h1 className={styles.title}>
				Faça o login para entrar no bate-papo
			</h1>
			<div className={styles.userInfo}>
				<div className={styles.overlay}>
					<div
						className={styles.userImage}
						onClick={inputClick}
						onMouseOver={() => setHideOverlay(true)}
						onMouseLeave={() => setHideOverlay(false)}
					>
						{hideOverlay ? <OverlayAvatar /> : null}

						<input
							type="file"
							name="fileInp"
							id="fileInp"
							className={styles.fileInp}
							ref={fileInput}
							accept="image/*"
							onChange={(event) => uploadImage(event)}
						/>
						<img
							src={preview ? preview : "/src/assets/userIcon.svg"}
							alt="User avatar"
						/>
					</div>
				</div>
				<input
					type="text"
					id="username"
					placeholder="Digite seu nome..."
					onChange={(e) => updateUsername(e)}
					required
				/>
				<button type="submit" onClick={sendInfo}>
					<CgEnter size="24px" />
				</button>
			</div>
		</div>
	);
}
