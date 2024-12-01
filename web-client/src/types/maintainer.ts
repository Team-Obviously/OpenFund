export interface MaintainerRepositoriesResponse {
    status: string
    data: MaintainerRepositoriesData
}

export interface MaintainerRepositoriesData {
    repositories: Repository[]
}

export interface MaintainerRepositoryDetailsResponse {
    status: string
    data: Repository
}

export interface MaintainerRepositoriesData {
    repositories: Repository[]
}

export interface Repository {
    donations: Donation[]
    _id: string
    name: string
    url: string
    maintainer: string
    donators: Donator[]
    issues: Issue[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Donation {
    _id: string
    amount: number
    userId: string
    repository: string
    createdAt: string
    updatedAt: string
}

export interface Donator {
    _id: string
    name: string
    email: string
    oktoAuthToken: string
    oktoRefreshToken: string
    oktoDeviceToken: string
    githubUsername: string
    createdAt: string
    updatedAt: string
}

export interface Issue {
    issueNumber: number
    title: string
    amount: number
    status: string
    creator: string
    assignee: any
    repository: string
    organizationName: string
    issueUrl: string
    htmlUrl: string
    createdAt: string
    updatedAt: string
}
