import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  ExternalLink,
  GitFork,
  Star,
  Users,
  History,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Contributor, Repository } from '@/types/repository'

export function RepositoryDetailsPage() {
  const { id, repoId } = useParams()
  const navigate = useNavigate()

  // Mock data - replace with API call
  const repository: Repository = {
    id: repoId || '',
    name: 'next.js',
    description: 'The React Framework for the Web',
    stars: 114000,
    forks: 24800,
    contributorsCount: 3200,
    allocatedFunds: 250000,
    language: 'TypeScript',
    org: '1',
    lastUpdated: '2024-03-20T10:00:00Z',
    openIssues: 1250,
    watchers: 3400,
    license: 'MIT',
    topics: ['framework', 'react', 'nextjs'],
    visibility: 'public',
    defaultBranch: 'main',
    size: 245000,
    contributors: [
      {
        id: '1',
        username: 'johndoe',
        avatarUrl: 'https://github.com/johndoe.png',
        contributions: 523,
        role: 'Maintainer',
      } as Contributor,
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold">{repository.name}</h2>
            <Badge variant="outline">ID: {repoId}</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid gap-6">
          {/* Repository Overview */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{repository.name}</h1>
              <p className="text-muted-foreground">{repository.description}</p>
            </div>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Star className="h-4 w-4" />
                Stars
              </div>
              <div className="text-2xl font-bold">
                {repository.stars.toLocaleString()}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <GitFork className="h-4 w-4" />
                Forks
              </div>
              <div className="text-2xl font-bold">
                {repository.forks.toLocaleString()}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                Contributors
              </div>
              <div className="text-2xl font-bold">
                {repository.contributorsCount.toLocaleString()}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <History className="h-4 w-4" />
                Allocated Funds
              </div>
              <div className="text-2xl font-bold">
                ${repository.allocatedFunds.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Contributors</h2>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                {repository.contributors.map((contributor) => (
                  <div
                    key={contributor.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={contributor.avatarUrl}
                        alt={contributor.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">
                          {contributor.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contributor.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {contributor.contributions.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          contributions
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
