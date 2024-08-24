import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from 'react-toastify';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyChLBF89DXXurgm0FovnrcRYN3bldwZruI",
	authDomain: "chat-app-demo-c3b16.firebaseapp.com",
	projectId: "chat-app-demo-c3b16",
	storageBucket: "chat-app-demo-c3b16.appspot.com",
	messagingSenderId: "720312047954",
	appId: "1:720312047954:web:4e6c21d8dbb8a9741b028b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

/**Signup method */
const signup = async (username, email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password)
		const user = res.user;
		await setDoc(doc(db, "users", user.uid), {
			id: user.uid,
			username: username.toLowerCase(),
			email,
			name: "",
			avatar: "",
			bio: "Hey, There i am using chat app",
			lastSeen: Date.now()
		})
		await setDoc(doc(db, "chats", user.uid), {
			chatsData: []
		})
	} catch (error) {
		console.error(error)
		// toast.error(error.code)
		toast.error(error.code.split('/')[1].split('-').join(" "))
	}
}

/**Login method */
const login = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		console.error(error)
		// toast.error(error.code)
		toast.error(error.code.split('/')[1].split('-').join(" "))
	}
}

/**Logout method */
const logout = async () => {
	try {
		await signOut(auth)
	} catch (error) {
		console.error(error)
		// toast.error(error.code)
		toast.error(error.code.split('/')[1].split('-').join(" "))
	}
}
/**Reset password method */
const resetPass = async (email) => {
	if (!email) {
		toast.error("Please enter your email")
		return null
	}
	try {
		const userRef = collection(db, "users")
		const q = query(userRef, where("email", "==", email))
		const querySnap = await getDocs(q);
		if (!querySnap.empty) {
			await sendPasswordResetEmail(auth, email);
			toast.success("Password reset email sent successfully");
		} else {
			toast.error("No user found with this email");
		}
	} catch (error) {
		console.error(error);
		toast.error(error.code.split('/')[1].split('-').join(" "));
	}
}
export { signup, login, logout, auth, db, resetPass }