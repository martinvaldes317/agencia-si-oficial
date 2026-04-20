import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleReCaptchaProvider reCaptchaKey="6LfsOsAsAAAAANfZA6vzm5Xl2XvqXETywb1eVNf7">
        <App />
      </GoogleReCaptchaProvider>
    </HelmetProvider>
  </StrictMode>,
)
