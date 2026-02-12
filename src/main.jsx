import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'

import { EventsContextProvider } from './EventsContext.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <StrictMode>
   
      <EventsContextProvider>
        <App />
      </EventsContextProvider>
    </StrictMode>
  </HashRouter>
)