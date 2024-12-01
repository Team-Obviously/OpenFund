import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Code } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackButton } from '@/components/ui/back-button'

interface Comment {
  id: number
  author: string
  content: string
  createdAt: string
  isReviewer: boolean
}

interface Change {
  id: number
  filename: string
  additions: number
  deletions: number
  status: 'added' | 'modified' | 'removed'
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: 'reviewerOne',
    content: 'Great work! Just a few minor suggestions for improvement.',
    createdAt: '2024-03-19T14:30:00Z',
    isReviewer: true,
  },
  {
    id: 2,
    author: 'contributorJane',
    content: 'Thanks for the feedback! Ive updated the code accordingly.',
    createdAt: '2024-03-19T15:45:00Z',
    isReviewer: false,
  },
]

const MOCK_CHANGES: Change[] = [
  {
    id: 1,
    filename: 'src/components/auth/LoginForm.tsx',
    additions: 25,
    deletions: 12,
    status: 'modified',
  },
  {
    id: 2,
    filename: 'src/utils/auth.ts',
    additions: 15,
    deletions: 5,
    status: 'modified',
  },
  {
    id: 3,
    filename: 'src/tests/auth.test.ts',
    additions: 45,
    deletions: 0,
    status: 'added',
  },
]

export function ContributionDetails() {
  const [activeTab, setActiveTab] = useState('overview')
  const [status] = useState<'pending' | 'accepted' | 'complete'>('complete')

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <BackButton />
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">
                  Fix Authentication System
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pull Request #123 in OSS Fund Backend
                </p>
              </div>
            </div>
            <Badge
              variant={
                status === 'complete'
                  ? 'secondary'
                  : status === 'accepted'
                  ? 'outline'
                  : 'default'
              }
            >
              {status}
            </Badge>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Files Changed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_CHANGES.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_COMMENTS.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Additions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +
                  {MOCK_CHANGES.reduce(
                    (sum, change) => sum + change.additions,
                    0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Deletions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -
                  {MOCK_CHANGES.reduce(
                    (sum, change) => sum + change.deletions,
                    0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p>
                      This pull request fixes several authentication-related
                      issues:
                    </p>
                    <ul>
                      <li>Resolves token expiration handling</li>
                      <li>
                        Adds proper error messages for failed auth attempts
                      </li>
                      <li>Implements refresh token mechanism</li>
                      <li>Adds comprehensive test coverage</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changes" className="space-y-4">
              {MOCK_CHANGES.map((change) => (
                <Card key={change.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {change.filename}
                        </span>
                        <Badge
                          variant={
                            change.status === 'added'
                              ? 'secondary'
                              : change.status === 'removed'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {change.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600">
                          +{change.additions}
                        </span>
                        <span className="text-red-600">
                          -{change.deletions}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {MOCK_COMMENTS.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {comment.author}
                          </span>
                          {comment.isReviewer && (
                            <Badge variant="outline">Reviewer</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(comment.createdAt).toLocaleDateString()}
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
