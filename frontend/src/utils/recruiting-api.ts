
import api from './api';
import type { Recruit, RecruitingPipeline, RecruitingResource, ResourcePacket, JobPostTemplate, RecruitingBadge, RecruitingData, JobFeed, CityNode } from '../types';
import { 
    MOCK_RECRUITING_DATA, MOCK_BADGES, MOCK_PIPELINES, MOCK_RECRUITS, 
    MOCK_TEMPLATES, MOCK_RESOURCES, MOCK_PACKETS, MOCK_FEEDS, MOCK_CITIES 
} from '../mockData/recruiting';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches all necessary data for the Recruiting Center in one call.
 */
export async function fetchRecruitingData(): Promise<RecruitingData> {
    await delay(500);
    return MOCK_RECRUITING_DATA;
}

export async function fetchRecruitingBadges(): Promise<RecruitingBadge[]> {
    await delay(300);
    return MOCK_BADGES;
}

export async function savePipelines(pipelines: RecruitingPipeline[], defaultRecruitStageId: string | null): Promise<RecruitingPipeline[]> {
    await delay(600);
    console.log("Mock Save Pipelines:", pipelines, defaultRecruitStageId);
    return pipelines;
}

export async function createRecruit(recruit: Omit<Recruit, 'id' | 'applyDate' | 'source' | 'state' | 'hasLicense' | 'licensedStates' | 'notes'>): Promise<Recruit> {
    await delay(400);
    const newRecruit: Recruit = {
        ...recruit,
        id: `rec-${Math.floor(Math.random() * 10000)}`,
        applyDate: new Date().toISOString(),
        source: 'Manual Entry',
        state: 'CO', // Default for mock
        hasLicense: false,
        licensedStates: '',
        notes: ''
    };
    return newRecruit;
}

export async function updateRecruit(recruit: Partial<Recruit> & { id: string }): Promise<Recruit> {
    await delay(300);
    // Merge mock data with updates
    const existing = MOCK_RECRUITS.find(r => r.id === recruit.id) || MOCK_RECRUITS[0];
    return { ...existing, ...recruit };
}

export async function createJobPostTemplate(template: Omit<JobPostTemplate, 'id' | 'lastUpdated'>): Promise<JobPostTemplate> {
    await delay(300);
    return {
        ...template,
        id: `temp-${Date.now()}`,
        lastUpdated: new Date().toISOString()
    };
}

export async function updateJobPostTemplate(template: JobPostTemplate): Promise<JobPostTemplate> {
    await delay(300);
    return { ...template, lastUpdated: new Date().toISOString() };
}

export async function deleteJobPostTemplate(id: string): Promise<void> {
    await delay(200);
    console.log(`Deleted template ${id}`);
}

export async function createRecruitingResource(resource: Omit<RecruitingResource, 'id'>): Promise<RecruitingResource> {
    await delay(300);
    return {
        ...resource,
        id: `res-${Date.now()}`
    };
}

export async function updateRecruitingResource(resource: RecruitingResource): Promise<RecruitingResource> {
    await delay(300);
    return resource;
}

export async function deleteRecruitingResource(id: string): Promise<void> {
    await delay(200);
    console.log(`Deleted resource ${id}`);
}

export async function createResourcePacket(packet: Omit<ResourcePacket, 'id'>): Promise<ResourcePacket> {
    await delay(300);
    return {
        ...packet,
        id: `packet-${Date.now()}`
    };
}

export async function updateResourcePacket(packet: ResourcePacket): Promise<ResourcePacket> {
    await delay(300);
    return packet;
}

export async function deleteResourcePacket(id: string): Promise<void> {
    await delay(200);
    console.log(`Deleted packet ${id}`);
}

// --- Job Feeds ---

export async function fetchJobFeeds(): Promise<JobFeed[]> {
    await delay(400);
    return MOCK_FEEDS;
}

export async function createJobFeed(feedData: Omit<JobFeed, 'id' | 'createdAt' | 'xmlUrl'>): Promise<JobFeed> {
    await delay(500);
    return {
        ...feedData,
        id: `feed-${Date.now()}`,
        createdAt: new Date().toISOString(),
        xmlUrl: `https://api.mock.com/feeds/feed-${Date.now()}.xml`
    };
}

export async function deleteJobFeed(id: string): Promise<void> {
    await delay(200);
    console.log(`Deleted feed ${id}`);
}

// --- City Lookup ---

export async function searchCities(query: string): Promise<CityNode[]> {
    await delay(200);
    const lowerQ = query.toLowerCase();
    return MOCK_CITIES.filter(c => 
        c.city.toLowerCase().includes(lowerQ) || 
        c.state.toLowerCase().includes(lowerQ)
    );
}

export async function getTopCitiesByState(state: string, limit: number): Promise<CityNode[]> {
    await delay(200);
    return MOCK_CITIES.filter(c => c.state === state).slice(0, limit);
}
/*
Real requests



export async function fetchRecruitingData(): Promise<RecruitingData> {
    const { data } = await api.get('/recruiting/data');
    return data;
}

export async function fetchRecruitingBadges(): Promise<RecruitingBadge[]> {
    const { data } = await api.get('/recruiting/badges');
    return data;
}

export async function savePipelines(pipelines: RecruitingPipeline[], defaultRecruitStageId: string | null): Promise<RecruitingPipeline[]> {
    const { data } = await api.put('/recruiting/pipelines', { pipelines, defaultRecruitStageId });
    return data;
}

export async function createRecruit(recruit: Omit<Recruit, 'id' | 'applyDate' | 'source' | 'state' | 'hasLicense' | 'licensedStates' | 'notes'>): Promise<Recruit> {
    const { data } = await api.post('/recruiting/recruits', recruit);
    return data;
}

export async function updateRecruit(recruit: Partial<Recruit> & { id: string }): Promise<Recruit> {
    const { data } = await api.put(`/recruiting/recruits/${recruit.id}`, recruit);
    return data;
}

export async function createJobPostTemplate(template: Omit<JobPostTemplate, 'id' | 'lastUpdated'>): Promise<JobPostTemplate> {
    const { data } = await api.post('/recruiting/job-posts', template);
    return data;
}

export async function updateJobPostTemplate(template: JobPostTemplate): Promise<JobPostTemplate> {
    const { data } = await api.put(`/recruiting/job-posts/${template.id}`, template);
    return data;
}

export async function deleteJobPostTemplate(id: string): Promise<void> {
    await api.delete(`/recruiting/job-posts/${id}`);
}

export async function createRecruitingResource(resource: Omit<RecruitingResource, 'id'>): Promise<RecruitingResource> {
    const { data } = await api.post('/recruiting/resources', resource);
    return data;
}

export async function updateRecruitingResource(resource: RecruitingResource): Promise<RecruitingResource> {
    const { data } = await api.put(`/recruiting/resources/${resource.id}`, resource);
    return data;
}

export async function deleteRecruitingResource(id: string): Promise<void> {
    await api.delete(`/recruiting/resources/${id}`);
}

export async function createResourcePacket(packet: Omit<ResourcePacket, 'id'>): Promise<ResourcePacket> {
    const { data } = await api.post('/recruiting/packets', packet);
    return data;
}

export async function updateResourcePacket(packet: ResourcePacket): Promise<ResourcePacket> {
    const { data } = await api.put(`/recruiting/packets/${packet.id}`, packet);
    return data;
}

export async function deleteResourcePacket(id: string): Promise<void> {
    await api.delete(`/recruiting/packets/${id}`);
}

// --- Job Feeds ---

export async function fetchJobFeeds(): Promise<JobFeed[]> {
    const { data } = await api.get('/recruiting/feeds');
    return data;
}

export async function createJobFeed(feedData: Omit<JobFeed, 'id' | 'createdAt' | 'xmlUrl'>): Promise<JobFeed> {
    const { data } = await api.post('/recruiting/feeds', feedData);
    return data;
}

export async function deleteJobFeed(id: string): Promise<void> {
    await api.delete(`/recruiting/feeds/${id}`);
}

// --- City Lookup ---

export async function searchCities(query: string): Promise<CityNode[]> {
    const { data } = await api.get('/recruiting/cities/search', { params: { q: query } });
    return data;
}

export async function getTopCitiesByState(state: string, limit: number): Promise<CityNode[]> {
    const { data } = await api.get('/recruiting/cities/top', { params: { state, limit } });
    return data;
}
*/