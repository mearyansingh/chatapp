import { useContext, useEffect, useState } from 'react'
import LeftSidebar from '../../Components/LeftSidebar'
import ChatBox from '../../Components/ChatBox'
import RightSidebar from '../../Components/RightSidebar'
import { AppContext } from '../../Context/AppContext'

function Chat() {

	/**Context */
	const { chatData, userData } = useContext(AppContext)

	/**Initial State */
	const [loading, setLoading] = useState(true)

	/**Lifecycle hook */
	useEffect(() => {
		if (chatData && userData) {

			setLoading(false)
		}
	}, [chatData, userData])

	return (
		<div className='chat background z-0'>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			{loading ?
				<div className='loading text-center z-1'>
					<div className="loader"></div>
					<div>Loading...</div>
				</div>
				:
				<div className="chat-container z-2 overflow-hidden rounded shadow-sm">
					<LeftSidebar />
					<ChatBox />
					<RightSidebar />
				</div>
			}
		</div>
	)
}

export default Chat