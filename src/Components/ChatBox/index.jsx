import { useContext, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import Assets from '../../assets/Assets'
import { AppContext } from '../../Context/AppContext'
import { db } from '../../Config/Firebase'
import upload from '../../Lib/Upload'
function ChatBox() {

	/**Context*/
	const { userData, messagesId, messages, setMessages, chatUser, chatVisible, setChatVisible } = useContext(AppContext)

	/**Initial state */
	const [input, setInput] = useState("")

	/**Lifecycle hook */
	useEffect(() => {
		if (messagesId) {
			const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
				setMessages(res.data().messages.reverse())
			})
			return () => unSub(); // cleanup function
		}

	}, [messagesId])

	const handleSendMsg = async () => {
		try {
			if (input && messagesId) {
				await updateDoc(doc(db, "messages", messagesId), {
					messages: arrayUnion({
						sId: userData.id,
						text: input,
						createdAt: new Date()
					})
				})

				const userIds = [chatUser.rId, userData.id]

				userIds.forEach(async (id) => {
					const userChatsRef = doc(db, 'chats', id)
					const userChatsSnapshot = await getDoc(userChatsRef)

					if (userChatsSnapshot.exists()) {
						const userChatData = userChatsSnapshot.data()
						const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId)
						userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
						userChatData.chatsData[chatIndex].updatedAt = Date.now()
						if (userChatData.chatsData[chatIndex].rId === userData.id) {
							userChatData.chatsData[chatIndex].messageSeen = false
						}
						await updateDoc(userChatsRef, {
							chatsData: userChatData.chatsData
						})
					}
				})
			}
		} catch (error) {
			toast.error(error.message)
			console.error(error)
		}
		setInput("")
	}

	const convertTimestamp = (timestamp) => {
		let date = timestamp.toDate()
		const hour = date.getHours()
		const minute = date.getMinutes()
		if (hour > 12) {
			return hour - 12 + ":" + minute + " PM"
		} else {
			return hour + ":" + minute + " AM"
		}
	}

	const handleSendImg = async (e) => {
		e.preventDefault();
		try {
			const fileUrl = await upload(e.target.files[0])
			if (fileUrl && messagesId) {
				await updateDoc(doc(db, "messages", messagesId), {
					messages: arrayUnion({
						sId: userData.id,
						image: fileUrl,
						createdAt: new Date()
					})
				})
				const userIds = [chatUser.rId, userData.id]

				userIds.forEach(async (id) => {
					const userChatsRef = doc(db, 'chats', id)
					const userChatsSnapshot = await getDoc(userChatsRef)

					if (userChatsSnapshot.exists()) {
						const userChatData = userChatsSnapshot.data()
						const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId)
						userChatData.chatsData[chatIndex].lastMessage = "Image"
						userChatData.chatsData[chatIndex].updatedAt = Date.now()
						if (userChatData.chatsData[chatIndex].rId === userData.id) {
							userChatData.chatsData[chatIndex].messageSeen = false
						}
						await updateDoc(userChatsRef, {
							chatsData: userChatData.chatsData
						})
					}
				})
			}
		} catch (error) {
			toast.error(error.message)
		}
	}

	return chatUser ? (
		<div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
			<div className="chat-user">
				<Image src={chatUser?.userData?.avatar} alt="" />
				<p className='mb-0'>{chatUser?.userData?.name} {Date.now() - chatUser?.userData?.lastSeen <= 70000 ? <Image className='dot' src={Assets.green_dot} alt="" /> : null}</p>
				<Image src={Assets.help_icon} alt="" className='help' />
				<Image src={Assets.arrow_icon} alt="" className='arrow' onClick={() => setChatVisible(false)} />
			</div>
			<div className="chat-msg">
				{messages.map((msg, index) => (
					<div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
						{msg["image"]
							?
							<Image className='msg-img' src={msg?.image} />
							:
							<p className="msg">{msg?.text}</p>
						}
						<div>
							<Image src={msg.sId === userData.id ? userData?.avatar : chatUser?.userData?.avatar} alt="" />
							<p className='mb-0'>{convertTimestamp(msg?.createdAt)}</p>
						</div>
					</div>
				))}
			</div>
			<div className="chat-input">
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Send a message'
				/>
				<input
					type='file'
					id="image"
					accept='image/png image/jpeg'
					hidden
					onChange={handleSendImg}
				/>
				<label htmlFor="image">
					<Image src={Assets.gallery_icon} alt="" />
				</label>
				<Image src={Assets.send_button} onClick={handleSendMsg} alt='' />
			</div>
		</div>
	)
		:
		<div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
			<Image src={Assets.logo_icon} alt='' />
			<p>Chat anytime, anywhere</p>
		</div>
}

export default ChatBox