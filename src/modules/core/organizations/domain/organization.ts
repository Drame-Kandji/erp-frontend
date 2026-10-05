export type OrganizationStatus = 'active' | 'inactive' | 'suspended'
export type OrganizationConfiguration = { 
  timezone: string; 
  language: string; 
  currency: string 
}
export type Organization = { 
  id: string; 
  name: string; 
  code: string; 
  description: string; 
  status: OrganizationStatus; 
  configuration: OrganizationConfiguration; 
  created_at: string; 
  updated_at: string 
}
export type OrganizationPayload = Omit<Organization, 'id' | 'created_at' | 'updated_at'>
export type OrganizationListResponse = { 
  count: number; 
  next: string | null; 
  previous: string | null; 
  results: Organization[] 
}