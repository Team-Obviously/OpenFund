import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Star, GitFork, Clock, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface GithubRepo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  private: boolean
}

export function GitHubCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      handleGithubCallback(code)
    } else {
      setError('No GitHub code found')
      setLoading(false)
    }
  }, [searchParams])

  const handleGithubCallback = async (code: string) => {
    try {
      setLoading(true)
      setError(null)

      // Exchange code for access token
      // const tokenResponse = await postRequest('/github/github-callback', {
      //   code,
      // })

      // if (!tokenResponse.ok) {
      //   throw new Error('Failed to exchange code for token')
      // }

      // const { access_token } = await tokenResponse.json()

      // // Fetch user's repositories
      // const reposResponse = await fetch('https://api.github.com/user/repos', {
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //     Accept: 'application/vnd.github.v3+json',
      //   },
      // })

      // if (!reposResponse.ok) {
      //   throw new Error('Failed to fetch repositories')
      // }

      // const repositories = await reposResponse.json()
      // setRepos(repositories)
    } catch (error) {
      console.error('Error handling GitHub callback:', error)
      setError('Failed to connect to GitHub')
    } finally {
      navigate('/dashboard/donator')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-lg font-semibold">Connecting to GitHub...</h2>
          <p className="text-muted-foreground">
            Please wait while we verify your account
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold text-destructive">{error}</h2>
          <Button variant="outline" onClick={() => navigate('/signup')}>
            Back to Signup
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your GitHub Repositories</h1>
        <Badge variant="outline" className="text-sm">
          {repos.length} repositories found
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo) => (
          <Card key={repo.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold hover:text-primary">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo.name}
                    </a>
                  </h3>
                  {repo.private && (
                    <Badge variant="secondary" className="mt-1">
                      Private
                    </Badge>
                  )}
                </div>
                {repo.language && (
                  <Badge variant="outline">{repo.language}</Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    {repo.forks_count}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate('/signup')}
          className="text-primary hover:underline"
        >
          Back to Signup
        </button>
      </div>
    </div>
  )
}
