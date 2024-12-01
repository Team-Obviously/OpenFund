import { useState } from 'react'
// import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, MessageSquare } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Contributor {
  id: number
  username: string
  avatarUrl: string
  contributions: number
  lastContribution: string
  role: 'maintainer' | 'contributor' | 'reviewer'
}

interface Issue {
  id: number
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  createdAt: string
  updatedAt: string
  commentsCount: number
}

const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    id: 1,
    username: 'johndoe',
    avatarUrl: 'https://github.com/johndoe.png',
    contributions: 47,
    lastContribution: '2024-03-19T16:45:00Z',
    role: 'maintainer',
  },
  {
    id: 2,
    username: 'janedoe',
    avatarUrl: 'https://github.com/janedoe.png',
    contributions: 23,
    lastContribution: '2024-03-18T10:30:00Z',
    role: 'contributor',
  },
  // Add more mock contributors...
]

const MOCK_ISSUES: Issue[] = [
  {
    id: 1,
    title: 'API Authentication not working in production',
    description: 'Users are getting 401 errors when trying to authenticate...',
    status: 'open',
    priority: 'high',
    assignee: 'janedoe',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-19T14:30:00Z',
    commentsCount: 5,
  },
  {
    id: 2,
    title: 'Add documentation for new payment endpoints',
    description: 'We need to document the new payment integration endpoints...',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'johndoe',
    createdAt: '2024-03-17T09:00:00Z',
    updatedAt: '2024-03-18T16:20:00Z',
    commentsCount: 3,
  },
  // Add more mock issues...
]

export function ProjectDetails() {
  // const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('issues')

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-xl font-semibold">OSS Fund Backend</h1>
            <Badge variant="outline" className="text-sm">
              {MOCK_CONTRIBUTORS.length} contributors
            </Badge>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Open Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {MOCK_ISSUES.filter((i) => i.status === 'open').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {MOCK_ISSUES.filter((i) => i.status === 'in-progress').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {MOCK_CONTRIBUTORS.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {MOCK_CONTRIBUTORS.reduce(
                    (sum, contributor) => sum + contributor.contributions,
                    0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="contributors">Contributors</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-4">
              {MOCK_ISSUES.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{issue.title}</h3>
                          <Badge
                            variant={
                              issue.priority === 'high'
                                ? 'destructive'
                                : issue.priority === 'medium'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {issue.priority}
                          </Badge>
                          <Badge
                            variant={
                              issue.status === 'open'
                                ? 'default'
                                : issue.status === 'in-progress'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {issue.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {issue.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {issue.assignee && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {issue.assignee}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {issue.commentsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(issue.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="contributors" className="space-y-4">
              {MOCK_CONTRIBUTORS.map((contributor) => (
                <Card key={contributor.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={contributor.avatarUrl}
                          alt={contributor.username}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {contributor.username}
                            </h3>
                            <Badge variant="outline">{contributor.role}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {contributor.contributions} contributions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Last active:{' '}
                        {new Date(
                          contributor.lastContribution
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
