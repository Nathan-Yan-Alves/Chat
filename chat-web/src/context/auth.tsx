import React, { createContext, ReactNode, useState, useEffect } from "react";
import { api } from "../services/api";

type User = {
    username: string;
    avatarUrl: string;
};

interface IUser {
    token: string;
    info: {
        username: string;
        avatarUrl: string;
    };
}

type AuthContextData = {
    signed: boolean;
    user: User | null;
    signIn: (userInfo: User) => void;
    signOut: () => void;
};

type AuthProvider = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider) {
	const [user, setUser] = useState<User | null>(null);

	async function signIn(userInfo: User) {
		try {
			const res = await api.post<IUser>("/users/new", { userInfo });
			if (res) {
				const { token, info } = res.data;

				window.localStorage.setItem("@chat: token", token);
				setUser(info);
			}
		} catch (err) {
			alert("Usuário existente, digite outro e tente novamente");
		}
	}

	function signOut() {
		setUser(null);
		window.localStorage.removeItem("@chat: token");
	}

	useEffect(() => {
		const token = localStorage.getItem("@chat: token");

		if (token) {
			api.defaults.headers.common.authorization = `Bearer ${token}`;
			api.get<User>("/users/token").then((res) => {
				setUser(res.data);
			});
		}
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				signed: !!user,
				user,
				signIn,
				signOut,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
