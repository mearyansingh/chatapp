import { useContext, useEffect, useState } from 'react'
import { Dropdown, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Assets from '../../assets/Assets'
import { AppContext } from '../../Context/AppContext'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db, logout } from '../../Config/Firebase'

function LeftSidebar() {

	/**Context*/
	const { userData, chatData, messagesId, setMessagesId, chatUser, setChatUser, chatVisible, setChatVisible } = useContext(AppContext)

	/**Initial state */
	const [user, setUser] = useState(null)
	const [showSearch, setShowSearch] = useState(false)

	const searchHandler = async (e) => {
		try {
			const input = e.target.value;
			if (input) {
				setShowSearch(true)
				const userRef = collection(db, 'users');
				const q = query(userRef, where("username", "==", input.toLowerCase()))
				const querySnap = await getDocs(q);
				if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
					let userExist = false
					chatData?.map((user) => {
						if (user?.rId === querySnap.docs[0].data().id) {
							userExist = true
						}
					})
					if (!userExist) {
						setUser(querySnap.docs[0].data())
					}
				} else {
					setUser(null)
				}
			} else {
				setShowSearch(false)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const addChat = async () => {
		const massagesRef = collection(db, "messages");
		const chatRef = collection(db, "chats");
		try {
			const newMessageRef = doc(massagesRef)
			await setDoc(newMessageRef, {
				createAt: serverTimestamp(),
				messages: []
			})
			await updateDoc(doc(chatRef, user?.id), {
				chatsData: arrayUnion({
					messageId: newMessageRef?.id,
					lastMessage: "",
					rId: userData?.id,
					updatedAt: Date.now(),
					messageSeen: true
				})
			})
			await updateDoc(doc(chatRef, userData?.id), {
				chatsData: arrayUnion({
					messageId: newMessageRef?.id,
					lastMessage: "",
					rId: user?.id,
					updatedAt: Date.now(),
					messageSeen: true
				})
			})
			const uSnap = await getDoc(doc(db, "user", user.id))
			const uData = uSnap.data()
			setChatData({
				messagesId: newMessageRef.id,
				lastMessage: "",
				rId: user.id,
				updatedAt: Date.now(),
				messageSeen: true,
				userData: uData
			})
			setShowSearch(false)
			setChatVisible(true)
		} catch (error) {
			toast.error(error.message)
			console.error(error)
		}
	}

	const setChatData = async (item) => {
		try {
			setMessagesId(item.messageId)
			setChatUser(item)
			const userChatsRef = doc(db, "chats", userData.id)
			const userChatsSnapshot = await getDoc(userChatsRef)
			const userChatsData = userChatsSnapshot.data();
			const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId)
			userChatsData.chatsData[chatIndex].messageSeen = true
			await updateDoc(userChatsRef, {
				chatsData: userChatsData.chatsData
			})
			setChatVisible(true)
		} catch (error) {
			toast.error(error.message)
		}
	}

	useEffect(() => {

		const updateChatUserData = async () => {
			if (chatUser) {
				const userRef = doc(db, "user", chatUser.userData.id)
				const userSnap = await getDoc(userRef)
				const userData = userSnap.data()
				setChatUser((prev) => ({ ...prev, userData }))
			}
		}
		updateChatUserData()
	}, [chatData])

	return (
		<div className={`ls z-2 ${chatVisible ? "hidden" : ""}`}>
			<div className="ls-top">
				<div className="ls-nav">
					<Image className='logo' src={Assets.logo} alt="" />
					<Dropdown className="menu">
						<Dropdown.Toggle variant='link' id="menu" className='p-0 border-0'>
							<Image src={Assets.menu_icon} alt="" />
						</Dropdown.Toggle>
						<Dropdown.Menu align="end">
							<Dropdown.Item as={Link} to="/profile">Edit Profile</Dropdown.Item>
							<Dropdown.Item as="button" onClick={() => logout()}>Logout</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="ls-search">
					<Image src={Assets.search_icon} alt="" />
					<input type="text" placeholder="Search devaryan" onChange={searchHandler} />
				</div>
			</div>
			<div className="ls-list">
				{showSearch && user
					?
					<div onClick={addChat} className="friends add-user">
						<Image src={Assets.profile_img} alt="" />
						<p className='mb-0'>{user.name}</p>
					</div>
					:
					chatData?.map((item, index) => (
						<div key={index} onClick={() => setChatData(item)} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "msg-unseen"}`}>
							<Image src={item?.userData?.avatar} alt="" />
							<div>
								<p className='mb-0'>{item?.userData?.name}</p>
								<small>{item?.lastMessage}</small>
							</div>
						</div>
					))
				}
			</div>
		</div>
	)
}

export default LeftSidebar