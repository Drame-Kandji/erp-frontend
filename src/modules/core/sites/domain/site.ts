export type SiteStatus = 'active' | 'inactive' | 'suspended'
export type Site = { 
  id: string; 
  organization: string; 
  name: string; 
  code: string; 
  address: string; 
  latitude: string | null; 
  longitude: string | null; 
  status: SiteStatus; 
  created_at: string; 
  updated_at: string 
}
export type SitePayload = Omit<Site, 'id' | 'created_at' | 'updated_at'>

export type SiteListResponse = { 
  count: number; 
  next: string | null; 
  previous: string | null; 
  results: Site[] 
}