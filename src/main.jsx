import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import './index.css'
import AppContextProvider from './Context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<AppContextProvider>
				<App />
			</AppContextProvider>
		</BrowserRouter>
	</StrictMode>,
)
