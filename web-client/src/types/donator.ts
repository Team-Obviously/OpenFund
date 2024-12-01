export interface AllOrganisationsResponse {
    _id: string
    name: string
    repositories: {
        _id: string
        name: string
        githubUrl: string
        contributorsCount?: number
        allocatedFunds?: number
    }[]
}
  