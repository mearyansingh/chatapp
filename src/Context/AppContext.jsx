import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Config/Firebase';

// Create the context
export const AppContext = createContext();

// Create a provider component
const AppContextProvider = (props) => {

	/**Initial state */
	const [userData, setUserData] = useState(null)
	const [chatData, setChatData] = useState(null)
	const [messagesId, setMessagesId] = useState(null)
	const [messages, setMessages] = useState([])
	const [chatUser, setChatUser] = useState(null)
	const [chatVisible, setChatVisible] = useState(false)

	const navigate = useNavigate()

	const loadUserData = async (uid) => {
		try {
			const userRef = doc(db, 'users', uid)
			const userSnap = await getDoc(userRef)
			const userData = userSnap.data()
			setUserData(userData)
			if (userData.avatar && userData.name) {
				navigate('/chat')
			} else {
				navigate('/profile')
			}
			await updateDoc(userRef, {
				lastSeen: Date.now()
			})
			//TODO:check this below code
			setInterval(async () => {
				if (auth.chatUser) {
					// if (auth.currentUser) {
					await updateDoc(userRef, {
						lastSeen: Date.now()
					})
				}
			}, 60000)//1 minute
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (userData) {
			const chatRef = doc(db, 'chats', userData.id)
			//Get real time update with onSnapshot method
			const unSub = onSnapshot(chatRef, async (res) => {
				const chatItems = res.data().chatsData
				const tempData = []
				for (const item of chatItems) {
					const userRef = doc(db, 'users', item.rId)
					const userSnap = await getDoc(userRef)
					const userData = userSnap.data()
					tempData.push({ ...item, userData })
				}
				setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt))
			});
			return () => unSub(); // cleanup function
		}
	}, [userData])

	const value = {
		userData, setUserData,
		chatData, setChatData,
		loadUserData,
		messagesId, setMessagesId,
		messages, setMessages,
		chatUser, setChatUser,
		chatVisible, setChatVisible
	}

	return (
		<AppContext.Provider value={value}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider