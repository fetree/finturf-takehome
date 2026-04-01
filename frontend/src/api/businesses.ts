const BASE = '/api';

export interface Business {
  id: number;
  name: string;
  ein: string | null;
  business_type: string | null;
  state: string | null;
  website: string | null;
  date_founded: string | null;
  owner_name: string | null;
  created_at: string;
}

export interface Risk {
  id: number;
  monthly_revenue: number | null;
  outstanding_debt: number | null;
  num_employees: number | null;
  owner_credit_score: number | null;
  is_real: boolean | null;
  risk_score: number | null;
  risk_tier: string | null;
  evaluated_at: string;
}

export interface BusinessDetailData extends Business {
  latest_risk: Risk | null;
}

export interface BusinessCreate {
  name: string;
  ein?: string;
  business_type?: string;
  state?: string;
  website?: string;
  date_founded?: string;
  owner_name?: string;
}

export const api = {
  listBusinesses: (): Promise<Business[]> =>
    fetch(`${BASE}/businesses/`).then((r) => r.json()),

  getBusiness: (id: number): Promise<BusinessDetailData> =>
    fetch(`${BASE}/businesses/${id}`).then((r) => r.json()),

  createBusiness: (data: BusinessCreate): Promise<Business> =>
    fetch(`${BASE}/businesses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  evaluate: (id: number): Promise<Risk> =>
    fetch(`${BASE}/businesses/${id}/evaluate`, { method: 'POST' }).then((r) =>
      r.json(),
    ),

  getRiskHistory: (id: number): Promise<Risk[]> =>
    fetch(`${BASE}/businesses/${id}/risk-history`).then((r) => r.json()),
};
