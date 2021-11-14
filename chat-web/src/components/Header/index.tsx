import styles from "./styles.module.scss";
import { AuthContext } from "../../context/auth";
import React, { useContext } from "react";

export function Header() {
	const { user, signed, signOut } = useContext(AuthContext);

	return (
		<div className={styles.container}>
			<h1 className={styles.logo}>Chat by: Alves Dev</h1>
			{signed ? (
				<>
					<div className={styles.userInfo}>
						<div className={styles.userImage}>
							<img
								src={
									user
										? user.avatarUrl
										: "/src/assets/avatarIcon.svg"
								}
								alt={user ? user.username : "default Avatar"}
							/>
						</div>
						<button className={styles.signOut} onClick={signOut}>
                            Sair
						</button>
					</div>
				</>
			) : null}
		</div>
	);
}
