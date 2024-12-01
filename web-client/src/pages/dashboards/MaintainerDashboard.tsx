import { useState, useEffect } from 'react';
import { MaintainerRepositoriesResponse, Repository } from '../../types/maintainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, GitPullRequest, Plus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { postRequest } from '@/utility/generalServices'

interface Project {
  id: number
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  contributorCount: number
  pendingPRs: number
  createdAt: string
  lastActivity: string
  projectUrl: string
}

export function MaintainerDashboard() {
  const [repositories, setRepositories] = useState<MaintainerRepositoriesResponse>();
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    projectUrl: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        await getAllRepositories();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  // const totalContributors = repositories.reduce(
  //   (sum, project) => sum + project.contributorCount,
  //   0
  // )
  // const totalPendingPRs = repositories.reduce(
  //   (sum, project) => sum + project.pendingPRs,
  //   0
  // )

  const handleAddProject = async () => {
    const userId = JSON.parse(localStorage.getItem('user')!)._id
    const res = await postRequest('/repositories/create', {
      ...newProject,
      userId,
    })
    console.log(res)
    setShowAddProject(false)
    setNewProject({ name: '', description: '', projectUrl: '' })
    getAllRepositories();
  };

  const userDetails = JSON.parse(localStorage.getItem('user') || '{}');

  const getAllRepositories = async () => {
    const response = await postRequest('/repositories/maintainer', { maintainerId: userDetails._id });
    console.log('ALLREPOS:: ', response.data);
    setRepositories(response.data);
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Maintainer Dashboard</h1>
            <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter project description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">GitHub URL</Label>
                    <Input
                      id="url"
                      value={newProject.projectUrl}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          projectUrl: e.target.value,
                        })
                      }
                      placeholder="Enter GitHub repository URL"
                    />
                  </div>
                  <Button
                    onClick={handleAddProject}
                    disabled={
                      !newProject.name ||
                      !newProject.description ||
                      !newProject.projectUrl
                    }
                  >
                    Add Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{repositories?.data.repositories.length ?? 0}</div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContributors}</div>
              </CardContent>
            </Card> */}
            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending PRs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPendingPRs}</div>
              </CardContent>
            </Card> */}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-4">
            {repositories?.data.repositories.map((repo) => (
              <Card
                key={repo._id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/maintainer/projects/${repo._id}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg hover:text-primary">
                        <Link
                          to={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repo.name}
                        </Link>
                      </h3>
                      <a
                        // href={repo.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Badge
                        variant={'default'}
                      >
                        {
                          repo.donations?.length ? 'Funded' : 'No Donations'
                        }
                      </Badge>
                    </div>
                    {/* <p className="text-sm text-muted-foreground">
                      {repo.description}
                    </p> */}
                  </div>
                  <div className="flex items-center gap-6">
                    {/* <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {repo.contributorCount} contributors
                      </span>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {repo.pendingPRs} pending PRs
                      </span>
                    </div> */}
                    
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
