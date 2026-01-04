import type { 
    Recruit, RecruitingPipeline, RecruitingResource, ResourcePacket, 
    JobPostTemplate, RecruitingBadge, JobFeed, CityNode, RecruitingData 
} from '../types';

// --- Shared Constants ---
export const MOCK_CITIES: CityNode[] = [
    { city: "Denver", state: "CO", population: 715000, zip: "80202" },
    { city: "Austin", state: "TX", population: 960000, zip: "73301" },
    { city: "Nashville", state: "TN", population: 690000, zip: "37201" },
    { city: "Phoenix", state: "AZ", population: 1600000, zip: "85001" },
];

export const MOCK_RESOURCES: RecruitingResource[] = [
    {
        id: "res-101",
        type: "video",
        title: "Company Vision 2026",
        description: "A 5-minute intro to our culture and future.",
        category: "Onboarding",
        contentUrl: "https://vimeo.com/123456",
        thumbnailUrl: "https://placehold.co/600x400/png"
    },
    {
        id: "res-102",
        type: "document",
        title: "Commission Structure PDF",
        description: "Detailed breakdown of comp plan.",
        category: "Compensation",
        contentUrl: "https://s3.aws.com/docs/comp-plan.pdf",
        thumbnailUrl: "https://placehold.co/600x400/png"
    },
    {
        id: "res-103",
        type: "script",
        title: "Cold Call Script v2",
        description: "Standard opening for new leads.",
        category: "Sales Training",
        contentUrl: "", // Scripts might be text content
        thumbnailUrl: ""
    }
];

export const MOCK_PACKETS: ResourcePacket[] = [
    {
        id: "packet-A",
        name: "New Agent Welcome Kit",
        resourceIds: ["res-101", "res-102"]
    },
    {
        id: "packet-B",
        name: "Sales Training Starter",
        resourceIds: ["res-103"]
    }
];

export const MOCK_PIPELINES: RecruitingPipeline[] = [
    {
        id: "pipe-main",
        name: "Standard Agent Recruitment",
        stages: [
            {
                id: "stage-1",
                title: "New Lead",
                automations: [
                    { id: "auto-1", action: "send-text", targetId: "sms-template-welcome" }
                ]
            },
            {
                id: "stage-2",
                title: "Interview Scheduled",
                automations: []
            },
            {
                id: "stage-3",
                title: "Contract Sent",
                automations: [
                    { id: "auto-2", action: "send-packet", targetId: "packet-A" }
                ]
            }
        ]
    }
];

export const MOCK_RECRUITS: Recruit[] = [
    {
        id: "rec-55",
        name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        phone: "+15550199",
        stage: "stage-2",
        applyDate: "2025-12-01T10:00:00Z",
        source: "LinkedIn",
        state: "CO",
        hasLicense: true,
        licensedStates: "CO, WY",
        notes: "Strong sales background, ready to start immediately."
    },
    {
        id: "rec-89",
        name: "Mike Ross",
        email: "mross@example.com",
        phone: "+15550200",
        stage: "stage-1",
        applyDate: "2026-01-02T14:30:00Z",
        source: "Referral",
        state: "NY",
        hasLicense: false,
        licensedStates: "",
        notes: "Needs to schedule licensing exam."
    }
];

export const MOCK_TEMPLATES: JobPostTemplate[] = [
    {
        id: "temp-1",
        title: "Remote Sales Agent - High Commission",
        content: "<p>We are looking for self-starters...</p>",
        lastUpdated: "2025-11-20T09:00:00Z"
    },
    {
        id: "temp-2",
        title: "Sales Manager / Team Lead",
        content: "<p>Lead a team of high performers...</p>",
        lastUpdated: "2025-12-10T11:15:00Z"
    }
];

export const MOCK_BADGES: RecruitingBadge[] = [
    {
        id: "badge-1",
        name: "First Hire",
        description: "You successfully recruited your first agent!",
        icon: "trophy-outline",
        earned: true,
        viewed: true
    },
    {
        id: "badge-2",
        name: "Pipeline Master",
        description: "Move 50 candidates through the pipeline.",
        icon: "graph-up",
        earned: false,
        viewed: false
    }
];

export const MOCK_FEEDS: JobFeed[] = [
    {
        id: "feed-1",
        title: "Colorado Expansion Feed",
        description: "Aggressive hiring in Denver/Boulder area",
        salaryRange: "$80k - $150k",
        jobType: "Full-time",
        targets: [MOCK_CITIES[0]], // Denver
        createdAt: "2025-10-01T08:00:00Z",
        xmlUrl: "https://api.mysite.com/feeds/feed-1.xml"
    }
];

// Assuming the aggregate definition based on usage
export const MOCK_RECRUITING_DATA: RecruitingData = {
    recruits: MOCK_RECRUITS,
    pipelines: MOCK_PIPELINES,
    recruitingResources: MOCK_RESOURCES,
    resourcePackets: MOCK_PACKETS,
    jobPostTemplates: MOCK_TEMPLATES,
    // Add any other aggregate stats usually returned here
    stats: {
        totalCandidates: 142,
        activePipelines: 1,
        conversionRate: 12.5
    }
};