import { useEffect, useState } from 'react'
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
import { useParams } from 'react-router-dom'
import { postRequest } from '@/utility/generalServices'
import { Repository } from '@/types/maintainer'
import { MaintainerRepositoriesResponse, MaintainerRepositoryDetailsResponse } from '@/types/maintainer'

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
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('issues')
  const [repositoryDetails, setRepositoryDetails] = useState<Repository>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepositoryDetails();
  }, [projectId]);

  const getRepositoryDetails = async () => {
    try {
      setLoading(true);
      const response = await postRequest('/repositories/with-issues', { repositoryId: projectId });
      console.log('RESPONSE:: ', response.data.data.repository);
      setRepositoryDetails(response.data.data.repository);
    } catch (error) {
      console.error('Error fetching repository details:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!repositoryDetails) {
    return <div className="flex items-center justify-center h-screen">Repository not found</div>;
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-xl font-semibold">{repositoryDetails.name}</h1>
            <Badge variant="outline" className="text-sm">
              {/* {repositoryDetails.?.length || 0} contributors */}
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
                  {repositoryDetails.issues?.filter(i => i.status === 'open').length || 0}
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
                  {repositoryDetails.issues?.filter(i => i.status === 'in-progress').length || 0}
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
                  {repositoryDetails.donators?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Contributions (in Matic)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {repositoryDetails.donations?.reduce(
                    (sum, donation) => sum + donation.amount,
                    0
                  ) || 0} 
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
              {repositoryDetails.issues?.map((issue) => (
                <Card key={issue.issueUrl}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{issue.title}</h3>
                          <Badge
                            variant={
                              'default'
                            }
                          >
                            {issue.amount}
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
                          {issue.assignee}
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
                          {/* {issue} */}
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
              {repositoryDetails.donators?.map((donator) => (
                <Card key={donator._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={donator.name}
                          alt={donator.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {donator.name}
                            </h3>
                            <Badge variant="outline">Donator</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {/* {donator.} contributions */}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Last active:{' '}
                        {new Date(
                          donator.createdAt
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
