import {
  Users,
  GitFork,
  Star,
  Clock,
  Shield,
  ArrowLeft,
  ExternalLink,
  GitBranch,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Repository, Organization, StatItemProps } from '@/types/repository'

export function RepositoriesPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock organization data - replace with API call
  const organization: Organization = {
    id: id || '',
    name: 'OpenAI',
    description:
      'Advancing artificial intelligence research to benefit humanity',
    avatarUrl: 'https://github.com/openai.png',
  }

  const repositories: Repository[] = [
    {
      id: '1',
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
      topics: ['framework', 'react', 'nextjs', 'web'],
      visibility: 'public',
      defaultBranch: 'main',
      size: 245000,
      contributors: [],
    },
    // Add more repositories...
  ]

  const stats = {
    totalRepos: repositories.length,
    totalStars: repositories.reduce((acc, repo) => acc + repo.stars, 0),
    totalForks: repositories.reduce((acc, repo) => acc + repo.forks, 0),
    totalFunds: repositories.reduce(
      (acc, repo) => acc + repo.allocatedFunds,
      0
    ),
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
            <h2 className="font-semibold">{organization.name}</h2>
            <Badge variant="outline">ID: {id}</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {/* Organization Info */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={organization.avatarUrl}
            alt={organization.name}
            className="w-16 h-16 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground">{organization.description}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Repositories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRepos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalStars.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Forks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalForks.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Funds Allocated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalFunds.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Grid Layout for Repositories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <Card key={repo.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {repo.name}
                      <Badge
                        variant={
                          repo.visibility === 'private'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs px-2 py-0"
                      >
                        {repo.visibility}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {repo.description}
                    </p>
                  </div>
                  <Link
                    to={`/repositories/${repo.org}/repo/${repo.id}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Language and Topics */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Technologies</div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="px-2 py-0">
                      {repo.language}
                    </Badge>
                    {repo.topics.slice(0, 3).map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="px-2 py-0"
                      >
                        {topic}
                      </Badge>
                    ))}
                    {repo.topics.length > 3 && (
                      <Badge variant="outline" className="px-2 py-0">
                        +{repo.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Repository Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>{' '}
                    {(repo.size / 1024).toFixed(2)} MB
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Branch:</span>{' '}
                    <GitBranch className="h-3 w-3" />
                    {repo.defaultBranch}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>{repo.license}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(repo.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <div className="grid grid-cols-4 w-full gap-3">
                  {/* Stats Section */}
                  <StatItem
                    icon={<Star className="h-4 w-4" />}
                    value={repo.stars}
                    label="Stars"
                  />
                  <StatItem
                    icon={<GitFork className="h-4 w-4" />}
                    value={repo.forks}
                    label="Forks"
                  />
                  <StatItem
                    icon={<Users className="h-4 w-4" />}
                    value={repo.contributorsCount}
                    label="Contributors"
                  />
                  <StatItem
                    value={repo.allocatedFunds}
                    label="Funded"
                    isCurrency
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

function StatItem({ icon, value, label, isCurrency }: StatItemProps) {
  const formattedValue = isCurrency
    ? `$${(value / 1000).toFixed(1)}k`
    : value >= 1000
    ? `${(value / 1000).toFixed(1)}k`
    : value.toString()

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className={isCurrency ? 'font-medium text-foreground' : ''}>
          {formattedValue}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )
}
