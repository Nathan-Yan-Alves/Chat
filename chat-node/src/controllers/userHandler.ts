import User from "../models/UserModel";
import { Request, Response } from "express";
import { app } from "../db/initFirebase";
import {
	getStorage,
	ref,
	uploadString,
	getDownloadURL,
	StorageReference,
} from "firebase/storage";
import { sign, verify } from "jsonwebtoken";

async function uploadImg(username: string, avatarUrl: string) {
	const storage = getStorage(app);
	const storageRef = ref(storage, `UsersAvatar/${username}`);

	await uploadString(storageRef, avatarUrl, "data_url");

	return storageRef;
}

class UserHandler {
	async createUser(req: Request, res: Response) {
		try {
			const {
				userInfo: { username, avatarUrl },
			} = req.body;

			let storageRef: StorageReference;
			const usernameExists = await User.find({ username }).count();

			if (usernameExists > 0) {
				res.status(406).send("Usuário já existe");
				return;
			}

			if (avatarUrl != "default") {
				storageRef = await uploadImg(username, avatarUrl);
			} else {
				const storage = getStorage(app);
				storageRef = ref(storage, "UsersAvatar/userIcon.svg");
			}

			getDownloadURL(storageRef).then(async (url) => {
				const token = sign(
					{
						username,
						avatarUrl: url,
					},
					process.env.JWT_SECRET
				);

				let user = new User({
					username,
					avatarUrl: url,
				});

				await user.save();

				res.json({ token, user: { username, avatarUrl: url } });
			});
		} catch (err) {
			res.status(404).send(err.message);
		}
	}

	authenticateToken(req: Request, res: Response) {
		const authToken = req.headers.authorization;

		if (!authToken) {
			res.status(401).json("Token invalid");
		}

		const [, token] = authToken.split(" ");
		const verifyUser = verify(token, process.env.JWT_SECRET);

		res.send(verifyUser);
	}
}

export { UserHandler };
