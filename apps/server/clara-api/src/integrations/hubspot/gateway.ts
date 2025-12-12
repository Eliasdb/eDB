import { HubspotHttp } from './client';
import {
  HubspotObject,
  Properties,
  SearchRequest,
  SearchResponse,
} from './types';

const CONTACTS = '/crm/v3/objects/contacts';
const COMPANIES = '/crm/v3/objects/companies';
const DEALS = '/crm/v3/objects/deals';
const ASSOCIATIONS = '/crm/v4/associations';

export class HubspotGateway {
  constructor(private http: HubspotHttp) {}

  // ---------- Contacts ----------
  async createContact(props: Properties): Promise<HubspotObject> {
    return this.http.post(CONTACTS, { properties: props });
  }

  async updateContact(id: string, props: Properties): Promise<HubspotObject> {
    return this.http.patch(`${CONTACTS}/${id}`, { properties: props });
  }

  async findContactByEmail(email: string): Promise<HubspotObject | null> {
    const body: SearchRequest = {
      filterGroups: [
        { filters: [{ propertyName: 'email', operator: 'EQ', value: email }] },
      ],
      limit: 1,
    };
    const res = await this.http.post<SearchResponse>(
      `${CONTACTS}/search`,
      body,
    );
    return res.results?.[0] ?? null;
  }

  async upsertContactByEmail(
    email: string,
    props: Properties,
  ): Promise<HubspotObject> {
    const existing = await this.findContactByEmail(email);
    if (existing) {
      return this.updateContact(existing.id, { ...props, email }); // keep email aligned
    }
    return this.createContact({ ...props, email });
  }

  // ---------- Companies ----------
  async createCompany(props: Properties): Promise<HubspotObject> {
    return this.http.post(COMPANIES, { properties: props });
  }

  // ---------- Deals ----------
  async createDeal(props: Properties): Promise<HubspotObject> {
    return this.http.post(DEALS, { properties: props });
  }

  async updateDeal(id: string, props: Properties): Promise<HubspotObject> {
    return this.http.patch(`${DEALS}/${id}`, { properties: props });
  }

  // ---------- Associations ----------
  // e.g., associate contact -> company
  async associate(
    fromType: 'contacts' | 'companies' | 'deals',
    fromId: string,
    toType: 'contacts' | 'companies' | 'deals',
    toId: string,
    associationType: string = 'contact_to_company',
  ) {
    // v4 associations
    const path = `${ASSOCIATIONS}/${fromType}/${toType}/batch/create`;
    return this.http.post(path, {
      inputs: [
        { from: { id: fromId }, to: { id: toId }, type: associationType },
      ],
    });
  }
}
