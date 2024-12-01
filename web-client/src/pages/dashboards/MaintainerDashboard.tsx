import { useState } from 'react'
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

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'OSS Fund Backend',
    description:
      'Backend services and API endpoints powering the OSS Fund platform',
    status: 'active',
    contributorCount: 8,
    pendingPRs: 3,
    createdAt: '2024-01-01T00:00:00Z',
    lastActivity: '2024-03-19T16:45:00Z',
    projectUrl: 'https://github.com/oss-fund/backend',
  },
  {
    id: 2,
    name: 'Payment Integration SDK',
    description:
      'Official SDK for integrating payment processing with the OSS Fund platform',
    status: 'completed',
    contributorCount: 5,
    pendingPRs: 0,
    createdAt: '2023-11-15T00:00:00Z',
    lastActivity: '2024-03-18T10:30:00Z',
    projectUrl: 'https://github.com/oss-fund/payment-sdk',
  },
  {
    id: 3,
    name: 'Documentation Site',
    description:
      'Official documentation and guides for OSS Fund platform and related tools',
    status: 'on-hold',
    contributorCount: 3,
    pendingPRs: 2,
    createdAt: '2024-02-10T00:00:00Z',
    lastActivity: '2024-03-15T09:20:00Z',
    projectUrl: 'https://github.com/oss-fund/docs',
  },
]

export function MaintainerDashboard() {
  const [projects] = useState<Project[]>(MOCK_PROJECTS)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    projectUrl: '',
  })
  const navigate = useNavigate()

  const totalContributors = projects.reduce(
    (sum, project) => sum + project.contributorCount,
    0
  )
  const totalPendingPRs = projects.reduce(
    (sum, project) => sum + project.pendingPRs,
    0
  )

  const handleAddProject = () => {
    // Handle project addition logic here
    setShowAddProject(false)
    setNewProject({ name: '', description: '', projectUrl: '' })
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
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContributors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending PRs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPendingPRs}</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/maintainer/projects/${project.id}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg hover:text-primary">
                        <Link
                          to={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.name}
                        </Link>
                      </h3>
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Badge
                        variant={
                          project.status === 'active'
                            ? 'secondary'
                            : project.status === 'completed'
                            ? 'outline'
                            : 'default'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {project.contributorCount} contributors
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {project.pendingPRs} pending PRs
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Last active:{' '}
                      {new Date(project.lastActivity).toLocaleDateString()}
                    </div>
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
