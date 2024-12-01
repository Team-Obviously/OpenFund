export interface MaintainerRepositoriesResponse {
    status: string
    data: MaintainerRepositoriesData
}

export interface MaintainerRepositoriesData {
    repositories: Repository[]
}

export interface Repository {
    _id: string
    name: string
    url: string
    maintainer: string
    donators: any[]
    issues: any[]
    createdAt: string
    updatedAt: string
    __v: number
    donations?: string[]
}
