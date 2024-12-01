import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ExternalLink, Users, Calendar, DollarSign, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Project } from '@/types/repository'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { getRequest } from '@/utility/generalServices'

type Donation = {
  id: string
  projectId: string
  projectName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  transactionHash?: string
}

type Organization = {
  id: string
  name: string
  projects: Project[]
}

export function DonatorDashboard() {
  const [selectedOrg, setSelectedOrg] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [showThankYou, setShowThankYou] = useState(false)
  const [donationDialog, setDonationDialog] = useState(false);
  const [organisations, setOrganisations] = useState<any>();

  useEffect(()=> {
    getAllOrganisations();  
  }, [])


  const getAllOrganisations = async () => {
    const response = await getRequest('/organisations/all');
    console.log('ALLORGS:: ', response.data);
    setOrganisations(response.data);
  };

  const getAllDonatedRepositories = async () => {
    const response = await getRequest('/repositories/my');
  }

  // Mock organizations data
  const organizations: Organization[] = [
    {
      id: '1',
      name: 'OpenAI',
      projects: [
        {
          id: '1',
          name: 'GPT-4',
          githubUrl: 'https://github.com/openai/gpt-4',
          contributorsCount: 150,
          fundedAmount: 100000,
        },
        {
          id: '2',
          name: 'DALL-E',
          githubUrl: 'https://github.com/openai/dall-e',
          contributorsCount: 75,
          fundedAmount: 50000,
        },
      ],
    },
    {
      id: '2',
      name: 'Meta',
      projects: [
        {
          id: '3',
          name: 'React',
          githubUrl: 'https://github.com/facebook/react',
          contributorsCount: 1500,
          fundedAmount: 200000,
        },
      ],
    },
  ]

  // Mock donations data
  const donations: Donation[] = [
    {
      id: '1',
      projectId: '1',
      projectName: 'GPT-4',
      amount: 1500,
      date: '2024-03-15',
      status: 'completed',
      transactionHash: '0x123...abc',
    },
    {
      id: '2',
      projectId: '3',
      projectName: 'React',
      amount: 2000,
      date: '2024-03-10',
      status: 'completed',
      transactionHash: '0x456...def',
    },
  ]

  const totalDonated = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  )
  const projects = organizations.flatMap((org) => org.projects)

  const handleDonation = () => {
    console.log('Donation:', {
      organizationId: selectedOrg,
      projectId: selectedProject,
      amount: Number(amount),
    })
    setDonationDialog(false) // Close donation dialog
    setShowThankYou(true) // Show thank you dialog
    setSelectedOrg('')
    setSelectedProject('')
    setAmount('')
  }

  const selectedOrgProjects = organizations.find(
    (org) => org.id === selectedOrg
  )?.projects

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <Dialog open={donationDialog} onOpenChange={setDonationDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Make Donation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make a Donation</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="organization">Organization</label>
                    <Select
                      value={selectedOrg}
                      onValueChange={(value) => {
                        setSelectedOrg(value)
                        setSelectedProject('') // Reset project when org changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedOrg && (
                    <div className="grid gap-2">
                      <label htmlFor="project">Project</label>
                      <Select
                        value={selectedProject}
                        onValueChange={setSelectedProject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedOrgProjects?.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{project.name}</span>
                                <span className="text-muted-foreground text-sm">
                                  ${project.fundedAmount.toLocaleString()}{' '}
                                  funded
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <label htmlFor="amount">Amount (USD)</label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>

                  <Button
                    onClick={handleDonation}
                    disabled={!selectedOrg || !selectedProject || !amount}
                  >
                    Submit Donation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Thank You Dialog */}
        <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thank You for Your Donation!</DialogTitle>
              <DialogDescription>
                Your contribution helps support open source development and
                makes a real difference.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowThankYou(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* Donation Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Donated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalDonated.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Projects Supported
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donations.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Supported Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <Link to={`/repositories/${project.id}`}>
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{project.name}</h2>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{project.contributorsCount} contributors</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right">
                        <div className="font-medium">
                          ${project.fundedAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Funded
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* My Donations Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">My Donations</h2>
            <div className="flex flex-col gap-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{donation.projectName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(donation.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-medium">
                        ${donation.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {donation.status}
                      </div>
                    </div>
                    {donation.transactionHash && (
                      <a
                        href={`https://etherscan.io/tx/${donation.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
