import { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Chat from './Pages/Chat'
import { auth } from './Config/Firebase';
import { AppContext } from './Context/AppContext';

function App() {

	/**Context*/
	const { loadUserData } = useContext(AppContext)
	const navigate = useNavigate()

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				navigate('/chat')
				// console.log(user, "user")
				await loadUserData(user.uid)
			} else {
				navigate('/')
			}
		})
	}, [])

	return (
		<>
			<ToastContainer />
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/chat' element={<Chat />} />
				<Route path='/profile' element={<Profile />} />
			</Routes>
		</>
	)
}

export default App
