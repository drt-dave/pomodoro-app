import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {PomodoroProvider} from './hooks/PomodoroContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<PomodoroProvider>
	  <App />
	</PomodoroProvider>
  </StrictMode>,
)

