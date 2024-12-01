import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BuildType, OktoProvider } from 'okto-sdk-react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <OktoProvider
        apiKey={import.meta.env.VITE_OKTO_APP_SECRET}
        buildType={BuildType.SANDBOX}
      >
        <App />
      </OktoProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
