//42min
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './AppRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import './global.css'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Auth0ProviderWithNavigate>
       <AppRoutes/>
      </Auth0ProviderWithNavigate>
    </Router>
  </StrictMode>
)
