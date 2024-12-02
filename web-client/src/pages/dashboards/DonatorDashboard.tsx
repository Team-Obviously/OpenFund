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
import { Link } from 'react-router-dom'
import { DashboardNav } from '@/components/ui/dashboard-nav'
import confetti from 'canvas-confetti'
import { WalletInfo } from '@/components/WalletInfo'

// interface Organization {
//   _id: string
//   name: string
//   description: string
//   totalProjects: number
//   githubUrl: string
// }

interface Donation {
  _id: string
  userId: string
  amount: number
}

interface Repository {
  _id: string
  name: string
  description: string
  maintainer: string
  currentFunding: number
  fundingGoal: number
  status: 'active' | 'completed'
  organizationName: string
  url: string
  totalDonations: number
  totalAmount: number
  donations: Donation[]
}

export function DonatorDashboard() {
  // const [organizations, setOrganizations] = useState<Organization[]>([])
  const [projects, setProjects] = useState<Repository[]>([])
  const [donations, setDonations] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('projects')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Repository | null>(
    null
  )
  const [donationAmount, setDonationAmount] = useState('')
  const { executeRawTransaction } = useOkto()!

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const userId = JSON.parse(localStorage.getItem('user') || '{}')['_id']
        const [projectsResponse, donationsResponse] = await Promise.all([
          // getRequest('/organisations/all'),
          getRequest('/repositories/all'),
          getRequest(`/repositories/my/${userId}`),
        ])
        // console.log(orgsResponse)
        // setOrganizations(
        //   Array.isArray(orgsResponse.data.data.organisations)
        //     ? orgsResponse.data.data.organisations
        //     : []
        // )
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

  const handleDonate = (project: Repository) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
    setDonationAmount('')
  }

  const triggerConfetti = () => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Side cannons
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
      })
    }, 200)
  }

  const handleDonationSubmit = async () => {
    try {
      // const encodedData = encodeDonateToRepository(
      //   selectedProject?.name || '',
      //   donationAmount
      // )
      // const res = await executeRawTransaction({
      //   network_name: 'BASE',
      //   transaction: encodedData,
      // })
      // console.log('Transaction:', res)

      // if (res) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await postRequest('/repositories/donate', {
        amount: donationAmount,
        repositoryId: selectedProject?._id,
        userId: userData._id,
      })

      if (response.data.status === 'success') {
        triggerConfetti()
        setIsDialogOpen(false)
        setTimeout(() => {
          window.location.reload()
        }, 4000)
      }
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
    <div className="flex flex-col h-screen">
      <DashboardNav />
      <div className="p-6 space-y-6 flex-1">
        <WalletInfo />
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Donator Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {/* <TabsTrigger value="organizations">Organizations</TabsTrigger> */}
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="my-donations">My Donations</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="organizations" className="space-y-4">
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
          </TabsContent> */}

          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Link
                        to={project.url}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CardTitle>{project.name}</CardTitle>
                      </Link>
                      <Badge
                        variant={
                          project.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
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
                        <span>Total Donations:</span>
                        <span className="font-medium">
                          {project.totalDonations}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Funding:</span>
                        <span className="font-medium">
                          ${project.totalAmount}
                        </span>
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
              {donations.map((donation) => {
                const myDonation = donation.donations.find(
                  (d) =>
                    d.userId ===
                    JSON.parse(localStorage.getItem('user') || '{}')._id
                )

                return (
                  <Card key={donation._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Link
                          to={donation.url}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CardTitle>{donation.name}</CardTitle>
                        </Link>
                      </div>
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
                          <span>My Donation:</span>
                          <span className="font-medium">
                            ${myDonation?.amount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Project Funding:</span>
                          <span className="font-medium">
                            ${donation.totalAmount}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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
    </div>
  )
}
