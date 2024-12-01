import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/ui/back-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import { getRequest, postRequest } from '@/utility/generalServices'
import { useOkto } from 'okto-sdk-react'
import { encodeDonateToRepository } from '@/utility/abiEncoder'

interface Organization {
  _id: string
  name: string
  description: string
  totalProjects: number
  githubUrl: string
}

interface Project {
  _id: string
  name: string
  description: string
  organizationName: string
  fundingGoal: number
  currentFunding: number
  status: 'active' | 'completed'
}

export function DonatorDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [donations, setDonations] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('organizations')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  const { executeRawTransaction } = useOkto()!

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [orgsResponse, projectsResponse, donationsResponse] =
          await Promise.all([
            getRequest('/organisations/all'),
            getRequest('/repositories/all'),
            getRequest('/repositories/my'),
          ])
        console.log(orgsResponse, projectsResponse, donationsResponse)
        setOrganizations(
          Array.isArray(orgsResponse.data.data.organisations)
            ? orgsResponse.data.data.organisations
            : []
        )
        setProjects(
          Array.isArray(projectsResponse.data.data.repositories)
            ? projectsResponse.data.data.repositories
            : []
        )
        setDonations(
          Array.isArray(donationsResponse.data.data.repositories)
            ? donationsResponse.data.data.repositories
            : []
        )
        setError(null)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDonate = (project: Project) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
    setDonationAmount('')
  }

  const handleDonationSubmit = async () => {
    try {
      const encodedData = encodeDonateToRepository(
        selectedProject?.name || '',
        donationAmount
      )
      console.log(encodedData)
      const res = await executeRawTransaction({
        network_name: 'POLYGON_TESTNET_AMOY',
        transaction: {
          to: encodedData.to,
          data: encodedData.data,
          value: encodedData.value,
          from: '0x28bAF7e11B58cac537559380e388C46168220a7d',
        },
      })
      console.log(res)
      // setIsDialogOpen(false)
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const re = await postRequest('/repositories/donate', {
        amount: donationAmount,
        repositoryId: selectedProject?._id,
        userId: userData._id,
      })
      console.log(re)
      // setIsDialogOpen(false)
    } catch (error) {
      console.error('Donation failed:', error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Donator Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="my-donations">My Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org) => (
              <Card key={org._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{org.name}</span>
                    <Badge variant="secondary">
                      {org.totalProjects} Projects
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {org.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <a
                    href={org.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View on GitHub
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card key={project._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.name}</span>
                    <Badge
                      variant={
                        project.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {project.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Organization:</span>
                      <span className="font-medium">
                        {project.organizationName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Funding Progress:</span>
                      <span className="font-medium">
                        ${project.currentFunding} / ${project.fundingGoal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (project.currentFunding / project.fundingGoal) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleDonate(project)}
                    >
                      Donate Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-donations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donations.map((donation) => (
              <Card key={donation._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{donation.name}</span>
                    <Badge
                      variant={
                        donation.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {donation.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {donation.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Organization:</span>
                      <span className="font-medium">
                        {donation.organizationName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Funding Progress:</span>
                      <span className="font-medium">
                        ${donation.currentFunding} / ${donation.fundingGoal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (donation.currentFunding / donation.fundingGoal) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {donations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                You haven't made any donations yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate to {selectedProject?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (USD)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter donation amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDonationSubmit}
              disabled={!donationAmount || parseFloat(donationAmount) <= 0}
            >
              Confirm Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
