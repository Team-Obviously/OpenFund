import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { GitPullRequest, CircleDot } from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'

interface Repository {
  id: number
  name: string
  description: string
  stars: number
}

interface Contribution {
  id: number
  title: string
  type: 'issue' | 'pr'
  status: 'open' | 'closed' | 'merged'
  repoName: string
  createdAt: string
}

const MOCK_CONTRIBUTED_REPOS: Repository[] = [
  {
    id: 1,
    name: 'OSS Fund Backend',
    description: 'Backend for the OSS Fund platform',
    stars: 45,
  },
  {
    id: 2,
    name: 'Community Docs',
    description: 'Documentation portal for the community',
    stars: 23,
  },
]

const MOCK_AVAILABLE_REPOS: Repository[] = [
  {
    id: 3,
    name: 'Design System',
    description: 'Shared component library',
    stars: 89,
  },
  {
    id: 4,
    name: 'Analytics Dashboard',
    description: 'Real-time analytics platform',
    stars: 34,
  },
]

const MOCK_CONTRIBUTIONS: Contribution[] = [
  {
    id: 1,
    title: 'Fix Authentication System',
    type: 'pr',
    status: 'merged',
    repoName: 'OSS Fund Backend',
    createdAt: '2024-03-19',
  },
  {
    id: 2,
    title: 'Add API Documentation',
    type: 'issue',
    status: 'closed',
    repoName: 'Community Docs',
    createdAt: '2024-03-18',
  },
]

export function ContributorDashboard() {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [activeTab, setActiveTab] = useState('contributed')

  const getContributionsForRepo = (repoName: string) => {
    return MOCK_CONTRIBUTIONS.filter((c) => c.repoName === repoName)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Contributor Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contributed">My Contributions</TabsTrigger>
          <TabsTrigger value="available">Available Repositories</TabsTrigger>
        </TabsList>

        <TabsContent value="contributed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CONTRIBUTED_REPOS.map((repo) => (
              <Card
                key={repo.id}
                className="cursor-pointer hover:border-primary"
                onClick={() => setSelectedRepo(repo)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{repo.name}</span>
                    <Badge variant="secondary">{repo.stars} ★</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {repo.description}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_AVAILABLE_REPOS.map((repo) => (
              <Card
                key={repo.id}
                className="cursor-pointer hover:border-primary"
                onClick={() => setSelectedRepo(repo)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{repo.name}</span>
                    <Badge variant="secondary">{repo.stars} ★</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {repo.description}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedRepo && (
        <Card>
          <CardHeader>
            <CardTitle>Contributions to {selectedRepo.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getContributionsForRepo(selectedRepo.name).map(
                (contribution) => (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {contribution.type === 'pr' ? (
                        <GitPullRequest className="h-5 w-5 text-purple-500" />
                      ) : (
                        <CircleDot className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <h3 className="font-medium">{contribution.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created on{' '}
                          {new Date(
                            contribution.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        contribution.status === 'merged'
                          ? 'secondary'
                          : contribution.status === 'closed'
                          ? 'outline'
                          : 'default'
                      }
                    >
                      {contribution.status}
                    </Badge>
                  </div>
                )
              )}
              {getContributionsForRepo(selectedRepo.name).length === 0 && (
                <p className="text-center text-muted-foreground">
                  No contributions yet to this repository
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
