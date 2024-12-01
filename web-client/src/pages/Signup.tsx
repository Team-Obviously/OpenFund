import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOkto } from 'okto-sdk-react'
import { GoogleLogin } from '@react-oauth/google'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { postRequest } from '@/utility/generalServices'
import { Github } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface LoginPageProps {
  setAuthToken: (token: string) => void
  authToken: string | null
  handleLogout: () => void
}

interface GoogleCredentialResponse {
  credential: string
}

interface AuthResponse {
  auth_token: string
}

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const REDIRECT_URI = `${window.location.origin}/github-auth`

const OKTO_URL = 'https://sandbox-api.okto.tech/api/v2/authenticate'

const LoginPage: React.FC<LoginPageProps> = ({
  setAuthToken,
  authToken,
  handleLogout,
}) => {
  const navigate = useNavigate()
  const { authenticate } = useOkto()!
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false)
  const [showGithubAuth, setShowGithubAuth] = useState(false)
  const [githubUsername, setGithubUsername] = useState('')
  const [name, setName] = useState('')
  const [oktoAuthResponse, setOktoAuthResponse] = useState<AuthResponse | null>(
    null
  )

  const handleGoogleLogin = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    if (!credentialResponse.credential) return

    const idToken = credentialResponse.credential

    // First authenticate with Okto
    authenticate(
      idToken,
      async (authResponse: AuthResponse | null, error: Error | null) => {
        try {
          if (authResponse) {
            setOktoAuthResponse(authResponse)
            setShowGithubAuth(true) // Show GitHub auth first
          } else if (error) {
            console.error('Okto authentication error:', error)
          }
        } catch (err) {
          console.error('Error during Okto authentication:', err)
        }
      }
    )
  }

  const handleGithubAuth = () => {
    const scope = 'read:user user:email'
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}`
    window.location.href = githubAuthUrl
  }

  const handleSubmitUserDetails = async () => {
    if (!oktoAuthResponse) return

    try {
      const response = await postRequest('/auth/signup', {
        oktoAuthResponse,
        userDetails: {
          name,
          githubUsername,
        },
      })

      if (response.success) {
        setAuthToken(oktoAuthResponse.auth_token)
        setShowUserDetailsForm(false)
        navigate(`/dashboard/contributor`)
      }
    } catch (error) {
      console.error('Error saving user details:', error)
    }
  }

  const onLogoutClick = () => {
    handleLogout()
    setOktoAuthResponse(null)
    setShowUserDetailsForm(false)
    setShowGithubAuth(false)
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {!authToken ? (
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleLogin(
                  credentialResponse as GoogleCredentialResponse
                )
              }
              onError={() => console.error('Google Login Failed')}
              useOneTap
            />
          ) : (
            <Button variant="outline" onClick={onLogoutClick}>
              Logout
            </Button>
          )}
        </CardContent>
      </Card>

      {/* GitHub Authentication Dialog */}
      <Dialog open={showGithubAuth} onOpenChange={setShowGithubAuth}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect GitHub Account</DialogTitle>
            <DialogDescription>
              Connect your GitHub account to continue. This allows us to verify
              your contributions and manage permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button
              onClick={handleGithubAuth}
              className="gap-2"
              variant="outline"
              size="lg"
            >
              <Github className="h-5 w-5" />
              Connect GitHub Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Form */}
      <Dialog open={showUserDetailsForm} onOpenChange={setShowUserDetailsForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="github">GitHub Username</Label>
              <Input
                id="github"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="Enter your GitHub username"
              />
            </div>
            <Button
              onClick={handleSubmitUserDetails}
              disabled={!githubUsername || !name}
            >
              Complete Signup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoginPage
