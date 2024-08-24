import { useContext, useEffect, useState } from 'react'
import { Button, Image } from 'react-bootstrap'
import Assets from '../../assets/Assets'
import { logout } from '../../Config/Firebase'
import { AppContext } from '../../Context/AppContext'

function RightSidebar() {

	/**Context*/
	const { messages, chatUser, } = useContext(AppContext)

	/**Initial  state*/
	const [msgImages, setMsgImages] = useState([])

	/**Lifecycle hook*/
	useEffect(() => {
		const tempVar = messages
			.filter((msg) => msg.image) // Only keep messages with images
			.map((msg) => msg.image); // Extract the image URLs

		setMsgImages(tempVar);
	}, [messages]);

	return chatUser ? (
		<div className='rs'>
			<div className="rs-profile">
				<Image fluid src={chatUser.userData.avatar} alt="Profile" />
				<h3>{Date.now() - chatUser.userData.lastSeen <= 70000 ? <Image className='dot' src={Assets.green_dot} alt="" /> : null}{chatUser.userData.name}</h3>
				<p>{chatUser.userData.bio}</p>
			</div>
			<hr />
			<div className="rs-media">
				<p className='mb-0'>Media</p>
				<div>
					{msgImages.map((img, index) => (
						<Image key={index} src={img} alt="" onClick={() => window.open(img)} />
					))}
				</div>
			</div>
			<Button size='sm' onClick={() => logout()}>Logout</Button>
		</div>
	)
		:
		<div className='rs'>
			<Button size='sm' onClick={() => logout()}>Logout</Button>
		</div>
}

export default RightSidebar