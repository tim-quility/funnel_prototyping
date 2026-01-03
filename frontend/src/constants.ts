import * as Types from './types';
import type { ScheduledCall, CallRecordingSettings, AgentCallRecording, Lead, LeadFieldLayout, LeadFieldConfig, LeadLayoutType, Quote,UsageRecord, StripeSubscription, LeadFile, LeadNote, LeadQualifierData, SalesData, AgentInfo, Tag, Team, TeamInvite, AgentActivity, FullAgentInfo, LeadVendor, MarketplaceItem, Order, PaymentMethod, TextTemplate, Workflow, WorkflowEnrollment, TrainingResource, Badge, SimulationHistory, Recruit, RecruitingPipeline, ResourcePacket, PipelineAutomation, JobPostTemplate, RecruitingBadge, Conversation, Script, WarmMarketContact, EmailTemplate, AgentConversation, Voicemail, RecruitingResource, Objection, Appointment, VoiceRecording, SmartListRule } from './types';

/*export const mockLeads: Lead[] = [
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '1', lead_id:'1', borrower_first:'John',borrower_last:'Doe', name: 'John Doe', company: 'Innovate Inc.', value: 50000, status: 'Qualified', avatarUrl: 'https://picsum.photos/seed/1/100', email: 'john.doe@innovate.com', phone: '555-0101', last_contacted: '2024-07-28T10:00:00Z', date_assigned: '2024-07-20T09:00:00Z', tags: ['Hot Lead', 'VIP'], state: 'CA', amount_contacted: 5, lead_type: 'Inbound', lead_level: 'Hot' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '2', lead_id:'2', borrower_first:'Jane',borrower_last:'Smith',name: 'Jane Smith', company: 'Tech Solutions', value: 75000, status: 'Contacted', avatarUrl: 'https://picsum.photos/seed/2/100', email: 'jane.smith@techsol.com', phone: '555-0102', last_contacted: '2024-07-29T14:30:00Z', date_assigned: '2024-07-21T11:00:00Z', tags: ['Follow-up'], state: 'NY', amount_contacted: 3, lead_type: 'Outbound', lead_level: 'Warm' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '3', lead_id:'3', borrower_first:'Peter',borrower_last:'Jones',name: 'Peter Jones', company: 'Data Systems', value: 25000, status: 'New', avatarUrl: 'https://picsum.photos/seed/3/100', email: 'peter.jones@datasys.co', phone: '555-0103', last_contacted: null, date_assigned: '2024-07-30T16:00:00Z', tags: [], state: 'TX', amount_contacted: 0, lead_type: 'Inbound', lead_level: 'Cold' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '4', lead_id:'4', borrower_first:'Mary',borrower_last:'Johnson',name: 'Mary Johnson', company: 'Creative Co.', value: 15000, status: 'New', avatarUrl: 'https://picsum.photos/seed/4/100', email: 'mary.j@creative.co', phone: '555-0104', last_contacted: null, date_assigned: '2024-07-30T17:00:00Z', tags: ['New'], state: 'FL', amount_contacted: 0, lead_type: 'Referral', lead_level: 'Warm' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '5', lead_id:'5', borrower_first:'David',borrower_last:'Williams',name: 'David Williams', company: 'Future Forward', value: 120000, status: 'Lost', avatarUrl: 'https://picsum.photos/seed/5/100', email: 'david.w@ff.inc', phone: '555-0105', last_contacted: '2024-07-25T12:00:00Z', date_assigned: '2024-07-15T09:00:00Z', tags: [], state: 'WA', amount_contacted: 8, lead_type: 'Outbound', lead_level: 'Hot' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '6', lead_id:'6', borrower_first:'Sarah',borrower_last:'Miller',name: 'Sarah Miller', company: 'Synergy Corp', value: 95000, status: 'Contacted', avatarUrl: 'https://picsum.photos/seed/6/100', email: 's.miller@synergy.com', phone: '555-0106', last_contacted: '2024-07-29T18:00:00Z', date_assigned: '2024-07-22T10:00:00Z', tags: ['Follow-up', 'High Value'], state: 'IL', amount_contacted: 4, lead_type: 'Inbound', lead_level: 'Warm' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '7', lead_id:'7', borrower_first:'Michael',borrower_last:'Brown',name: 'Michael Brown', company: 'Health Group', value: 45000, status: 'Qualified', avatarUrl: 'https://picsum.photos/seed/7/100', email: 'mbrown@healthgroup.com', phone: '555-0107', last_contacted: '2024-07-28T11:00:00Z', date_assigned: '2024-07-19T14:00:00Z', tags: ['VIP'], state: 'CA', amount_contacted: 6, lead_type: 'Referral', lead_level: 'Hot' },
    // FIX: Changed 'id' from number to string to match Lead interface.
    { id: '8', lead_id:'8', borrower_first:'Emily',borrower_last:'Davis',name: 'Emily Davis', company: 'NextGen', value: 30000, status: 'New', avatarUrl: 'https://picsum.photos/seed/8/100', email: 'emily.d@nextgen.tech', phone: '555-0108', last_contacted: null, date_assigned: '2024-07-31T09:00:00Z', tags: ['New'], state: 'MA', amount_contacted: 0, lead_type: 'Inbound', lead_level: 'Cold' },
];*/
//export const getTagByName = (name: string) => MOCK_GLOBAL_TAGS.find(t => t.name === name)!;

export const mockReminders = [
    { id: 'general', name: 'General Reminder Profile' },
    { id: 'important', name: 'Important Meeting Profile' },
];

// New: Mock Scheduled Calls
export const mockScheduledCalls: ScheduledCall[] = [
    {
        id: 'call_1',
        lead_id: '1',
        leadName: 'John Doe',
        leadPhone: '555-0101',
        title: 'Follow-up on Final Expense',
        notes: 'Discuss client\'s health concerns and provide quotes.',
        scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'scheduled',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'call_2',
        lead_id: '2',
        leadName: 'Jane Smith',
        leadPhone: '555-0102',
        title: 'Mortgage Protection Review',
        notes: 'Client expressed interest in increasing coverage.',
        scheduled_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        status: 'scheduled',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'call_3',
        lead_id: null,
        leadName: 'Internal Call',
        leadPhone: 'N/A',
        title: 'Team Sync-up',
        notes: 'Weekly discussion on Q3 goals.',
        scheduled_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        status: 'scheduled',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'call_4',
        lead_id: '3',
        leadName: 'Peter Jones',
        leadPhone: '555-0103',
        title: 'Advanced Market Intro',
        notes: 'Initial contact call for advanced market lead.',
        scheduled_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (past)
        status: 'completed',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'call_5',
        lead_id: '4',
        leadName: 'Mary Johnson',
        leadPhone: '555-0104',
        title: 'Cancelled Policy Discussion',
        notes: 'Client cancelled previous policy due to budget.',
        scheduled_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (past)
        status: 'canceled',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
];
export const mockSalesData: SalesData[] = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
];

export const mockAgentInfo: AgentInfo = {
    agentId: 101,
    // FIX: Changed 'organization' to 'organizationId' to match the AgentInfo interface.
    organizationId: 'master',
    admin: true,
    organizationName: 'Funnel',
    permissions: 'admin',
    agentCode: 'A1234',
    beta: true,
    a2pOnly: false,
    status: 'active',
    userName: 'johndoe',
    email: 'john.doe@funnel.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '(555) 123-4567',
    timezone: 'America/New_York',
    tutorial: 0,
    statsVisible: true,
    liveTransferOptIn: false,
    recruitingModuleActive: false,
};

export const mockSubscription = [
    { activeSubscription: true }
];



export const mockQueue = [
    { lead_id: '1', first_name: 'Alice', last_name: 'Johnson', phone_1: '555-0101', status: 'New Lead', last_dial: null, city: 'New York', state: 'NY', tags: 'Hot Lead, VIP', queuePos: 0 },
    { lead_id: '2', first_name: 'Bob', last_name: 'Williams', phone_1: '555-0102', status: 'Attempted Contact', last_dial: 1672444800, city: 'Los Angeles', state: 'CA', tags: 'Follow-up', queuePos: 1 },
    { lead_id: '3', first_name: 'Charlie', last_name: 'Brown', phone_1: '555-0103', status: 'Callback Scheduled', last_dial: 1672358400, city: 'Chicago', state: 'IL', tags: '', queuePos: 2 },
    { lead_id: '4', name: 'Diana Prince', phone_1: '555-0104', status: 'New Lead', last_dial: null, city: 'Boston', state: 'MA', tags: 'New, East Coast', queuePos: 3 },
    { lead_id: '5', name: 'Ethan Hunt', phone_1: '555-0105', status: 'Do Not Call', last_dial: 1672272000, city: 'Miami', state: 'FL', tags: 'DNC', queuePos: 4 },
];

export const mockAppInfo = {
    statuses: [
        { id: 1, name: 'New' },
        { id: 2, name: 'Contacted' },
        { id: 3, name: 'Qualified' },
        { id: 4, name: 'Lost' },
        { id: 5, name: 'Sold' },
        { id: 6, name: 'Do Not Call' },
    ],
    tags: [
        { id: 'tag_1', name: 'Hot Lead' },
        { id: 'tag_2', name: 'VIP' },
        { id: 'tag_3', name: 'Follow-up' },
        { id: 'tag_4', name: 'New' },
        { id: 'tag_5', name: 'East Coast' },
        { id: 'tag_6', name: 'DNC' },
        { id: 'tag_7', name: 'Long Term' },
    ],
    templates: {
        email: [
            { id: '1', name: 'Initial Outreach', subject: 'Following Up', body: 'Hi [FirstName], just following up on our conversation.' },
            { id: '2', name: 'Product Info', subject: 'Information about our services', body: 'Here is the product information you requested.' },
        ],
        text: [
            { id: 'txt_1', name: 'Appointment Reminder', body: 'Hi [FirstName], this is a reminder for your appointment tomorrow at [AppointmentTime].' },
            { id: 'txt_2', name: 'Quick Follow-up', body: 'Hey [FirstName], just checking in. Let me know if you have questions.' },
            { id: 'txt_4', name: 'No Answer Voicemail text', body: 'Hi [FirstName], I tried calling but missed you.' },
        ],
        scripts: [
            { id: '1', name: 'Opening Spiel', body: 'Hello, my name is [AgentFirstName] from Funnel...' },
        ],
        objections: [ // Added mock objections here
            { id: 'obj_1', name: 'Price is too high', body: 'I understand your concern about the price. Let me explain the value you get...' },
            { id: 'obj_2', name: 'Not interested', body: 'I hear that a lot. What specifically are you not interested in?' },
        ],
    },
    numbers: [
        { id: 1, number: '(555) 867-5309' },
        { id: 2, number: '(555) 123-4567' },
    ],
    agents: [
        { id: 101, name: 'John Doe' },
        { id: 102, name: 'Jane Smith' },
    ],
    lead_types: [
        { id: 'inbound', name: 'Inbound' },
        { id: 'outbound', name: 'Outbound' },
        { id: 'referral', name: 'Referral' },
    ],
    lead_levels: [
        { id: 'hot', name: 'Hot' },
        { id: 'warm', name: 'Warm' },
        { id: 'cold', name: 'Cold' },
    ],
    voicemail_drops: [
        { id: 1, name: 'Standard Voicemail' },
        { id: 2, name: 'Callback Request Voicemail' },
    ],
};

export const mockMarketData = [
    { title: 'New Lead Pack', description: '100 fresh leads in your area.', price: '500' },
    { title: 'Aged Lead Bundle', description: '500 aged leads for a great price.', price: '250' },
];

export const mockFilterData = [
    { name: 'Last 90 Days', search: '90', type: 'date' },
    { name: 'Hot Leads', search: 'hot', type: 'list' },
    { name: 'My Callbacks', search: 'callback', type: 'list' },
];

export const mockMissedCalls = [
    { lead_id: '4', name: 'Diana Prince', number: '555-0104', timestamp: 1672704000 },
];

// Updated mockVoicemails to match the new Voicemail interface
export const mockVoicemails: Voicemail[] = [
  // FIX: Changed 'lead_id: "none"' to 'lead_id: null' to match the updated Voicemail type in `types.ts`.
  { id: 'vm_1', lead_id: '4', name: 'Diana Prince', number: '555-0104', duration: 32, timestamp: 1672704000, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', message_heard: 'no', borrower_first: 'Diana', borrower_last: 'Prince', message_from: '555-0104', formatted_timestamp: 1672704000 },
  { id: 'vm_2', lead_id: '5', name: 'Ethan Hunt', number: '555-0105', duration: 45, timestamp: 1672790400, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', message_heard: 'yes', borrower_first: 'Ethan', borrower_last: 'Hunt', message_from: '555-0105', formatted_timestamp: 1672790400 },
  { id: 'vm_3', lead_id: null, name: 'Unknown Caller', number: '555-0106', duration: 20, timestamp: 1672876800, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', message_heard: 'no', message_from: '555-0106', formatted_timestamp: 1672876800 },
  { id: 'vm_4', lead_id: '1', name: 'John Doe', number: '555-0101', duration: 50, timestamp: 1672963200, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', message_heard: 'no', borrower_first: 'John', borrower_last: 'Doe', message_from: '555-0101', formatted_timestamp: 1672963200 },
  { id: 'vm_5', lead_id: '2', name: 'Jane Smith', number: '555-0102', duration: 25, timestamp: 1673049600, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', message_heard: 'yes', borrower_first: 'Jane', borrower_last: 'Smith', message_from: '555-0102', formatted_timestamp: 1673049600 },
];

// Mock Voice Recordings (agent recorded messages)
export const mockVoiceRecordings: VoiceRecording[] = [
    { id: 'vr_1', name: 'Standard Voicemail Greeting', file_url: '/uploads/standard_greeting.mp3', duration: 25, type: 'voicemail_box', is_default: true, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'vr_2', name: 'After-Hours Greeting', file_url: '/uploads/after_hours.mp3', duration: 35, type: 'voicemail_box', is_default: false, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'vr_3', name: 'Initial Follow-up Drop', file_url: '/uploads/follow_up_drop.mp3', duration: 40, type: 'voicemail_drop', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'vr_4', name: 'Appointment Reminder Drop', file_url: '/uploads/appt_reminder.mp3', duration: 30, type: 'voicemail_drop', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];


// Mock Appointments
export const mockAppointments: Appointment[] = [
    {
        id: 'appt_1',
        lead_id: '1',
        leadFirstName: 'John',
        leadLastName: 'Doe',
        title: 'Initial Consultation',
        description: 'Discuss final expense options for client.',
        appointmentTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
        timezone: 'America/New_York',
        type: 'meet',
        link: 'https://meet.google.com/abc-xyz-def',
        status: 'scheduled',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'appt_2',
        lead_id: '2',
        leadFirstName: 'Jane',
        leadLastName: 'Smith',
        title: 'Policy Review',
        description: 'Review existing mortgage protection policy.',
        appointmentTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        timezone: 'America/New_York',
        type: 'zoom',
        link: 'https://zoom.us/j/1234567890',
        status: 'scheduled',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'appt_3',
        lead_id: null, // No associated lead
        title: 'Team Meeting',
        description: 'Weekly team sync up.',
        appointmentTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins from now (within 3 hours)
        timezone: 'America/New_York',
        type: 'phone',
        link: undefined,
        status: 'scheduled',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 'appt_4',
        lead_id: '3',
        leadFirstName: 'Peter',
        leadLastName: 'Jones',
        title: 'Follow-up Call',
        description: 'Discuss proposal for advanced market product.',
        appointmentTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (past)
        timezone: 'America/New_York',
        type: 'phone',
        link: undefined,
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'appt_5',
        lead_id: '4',
        leadFirstName: 'Mary',
        leadLastName: 'Johnson',
        title: 'Initial Call',
        description: 'Introduce self and company.',
        appointmentTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago (past)
        timezone: 'America/New_York',
        type: 'home',
        link: undefined,
        status: 'canceled',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockTwilioToken = [
    { token: 'mock-twilio-token-string-12345', textingNumbers: ['(555) 867-5309', '(555) 123-4567'] }
];

export const mockRecordingConfig = [
    { consent: true, message: 'This call may be recorded for quality assurance.' }
];

export const mockTags: Tag[] = [
  { id: 'tag_1', name: 'Hot Lead', lead_count: 5, created: 1672531200 },
  { id: 'tag_2', name: 'VIP', lead_count: 2, created: 1672617600 },
  { id: 'tag_3', name: 'Follow-up', lead_count: 10, created: 1672704000 },
  { id: 'tag_4', name: 'New', lead_count: 8, created: 1672790400 },
  { id: 'tag_5', name: 'East Coast', lead_count: 3, created: 1672876800 },
  { id: 'tag_6', name: 'DNC', lead_count: 1, created: 1672963200 },
  { id: 'tag_7', name: 'Long Term', lead_count: 15, created: 1673049600 },
  { id: 'tag_8', name: 'West Coast', lead_count: 7, created: 1673136000 },
  { id: 'tag_9', name: 'High Value', lead_count: 4, created: 1673222400 },
  { id: 'tag_10', name: 'Needs Nurturing', lead_count: 12, created: 1673308800 },
  { id: 'tag_11', name: 'Competitor', lead_count: 6, created: 1673395200 },
  { id: 'tag_12', name: 'Past Customer', lead_count: 9, created: 1673481600 },
];

export const mockAgentTeams: Team[] = [
    {
        id: 'team_1',
        name: 'Base Shop',
        owner: 999,
        goalsEnabled: false,
        members: [
            { id: 102, agent_id: 102, first_name: 'Jane', last_name: 'Smith', statsVisible: true },
            { id: 103, agent_id: 103, first_name: 'Peter', last_name: 'Jones', statsVisible: true },
        ]
    },
    {
        id: 'team_2',
        name: 'Direct Agents',
        owner: 999,
        goalsEnabled: false,
        members: [
            { id: 104, agent_id: 'unknown', first_name: 'Mary', last_name: 'Johnson', agent_email: 'mary.j@example.com', statsVisible: true },
        ]
    },
];

export const mockYourTeams: Team[] = [
    {
        id: 'team_3',
        name: 'Alpha Team',
        owner: 101,
        goalsEnabled: true,
        goalSettings: [
            { metric: 'dials', period: 'weekly' },
            { metric: 'apv', period: 'monthly' },
        ],
        members: [
            { id: 101, agent_id: 101, first_name: 'John', last_name: 'Doe', goals: [{ metric: 'dials', period: 'weekly', target: 250 }, { metric: 'apv', period: 'monthly', target: 1200 }], statsVisible: true },
            { id: 105, agent_id: 105, first_name: 'David', last_name: 'Williams', goals: [{ metric: 'dials', period: 'weekly', target: 300 }, { metric: 'apv', period: 'monthly', target: 1500 }], statsVisible: false },
        ]
    },
    {
        id: 'team_4',
        name: 'Bravo Team',
        owner: 106,
        goalsEnabled: false,
        members: [
            { id: 101, agent_id: 101, first_name: 'John', last_name: 'Doe', statsVisible: true },
            { id: 106, agent_id: 106, first_name: 'Chris', last_name: 'Green', statsVisible: true },
        ]
    },
];

export const mockAllAgents: FullAgentInfo[] = [
    { id: 101, agent_id: 101, first_name: 'John', last_name: 'Doe', email: 'john.doe@funnel.com' },
    { id: 102, agent_id: 102, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
    { id: 103, agent_id: 103, first_name: 'Peter', last_name: 'Jones', email: 'peter.jones@example.com' },
    { id: 105, agent_id: 105, first_name: 'David', last_name: 'Williams', email: 'david.williams@example.com' },
    { id: 106, agent_id: 106, first_name: 'Chris', last_name: 'Green', email: 'chris.green@example.com' },
    { id: 107, agent_id: 107, first_name: 'Sarah', last_name: 'Connor', email: 'sarah.connor@example.com' },
    { id: 108, agent_id: 108, first_name: 'Kyle', last_name: 'Reese', email: 'kyle.reese@example.com' },
];

const deltaForceTeam: Team = {
    id: 'team_5',
    name: 'Delta Force',
    owner: 108,
    goalsEnabled: true,
    goalSettings: [
        { metric: 'dials', period: 'weekly' },
        { metric: 'contacts', period: 'weekly' },
    ],
    members: [
        { id: 108, agent_id: 108, first_name: 'Kyle', last_name: 'Reese', statsVisible: true }
    ]
};

export const mockTeamInvites: TeamInvite[] = [
    { inviteId: 'invite_1', teamId: 'team_5', name: 'Delta Force', team: deltaForceTeam },
];

const generateHistory = (days: number, max: number) => {
    const history = [];
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        history.push({
            date: date.toISOString(),
            value: Math.floor(Math.random() * max)
        });
    }
    return history;
}

const generateActivityHistory = (days: number, max: number) => {
    return generateHistory(days, max).map(h => {
        const calls = Math.floor(Math.random() * max) + 5;
        const contacts = Math.floor(calls * (Math.random() * 0.4 + 0.1)); // Contact rate between 10% and 50%
        return {
            dialDate: h.date,
            callsMade: String(calls),
            contacts: contacts,
            apv: Math.floor(Math.random() * 500) + 100,
        };
    });
};

const generatePurchaseHistory = (days: number, max: number) => {
    return generateHistory(days, max).map(h => ({
        purchaseDate: h.date,
        count: h.value
    }));
};

const createManualDialsForPastWeek = (totalDials: number, totalContacts: number) => {
    const dials = [];
    for(let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dailyDials = Math.floor(totalDials / 7) + (i <= totalDials % 7 ? 1 : 0);
        const dailyContacts = Math.floor(totalContacts / 7) + (i <= totalContacts % 7 ? 1 : 0);
        if (dailyDials > 0) {
            dials.push({
                dialDate: date.toISOString(),
                callsMade: String(dailyDials),
                contacts: Math.min(dailyContacts, dailyDials),
                apv: Math.floor(Math.random() * 150)
            });
        }
    }
    return dials;
}


export const mockAgentActivity: { [key: number]: AgentActivity } = {
    1: {
        dials: generateActivityHistory(90, 60),
        leadsPurchased: generatePurchaseHistory(90, 15),
        
        // --- ADDED MISSING AGGREGATES ---
        totalDials: 4500,
        totalContacts: 680,
        totalApv: 12500,
        totalLeadsPurchased: 1350,
        contactRate: 15.1,
        appointmentRate: 3.5,
        // --------------------------------

        scheduled: [{ apptTitle: 'Internal Review', apptDate: 1672531200, apptTimezone: 'EST', apptLead: 1 }],
        appointments: 3,
        scheduledCalls: [{ schedLeadFirst: 'Corp', schedLeadLast: 'Solutions', schedTime: 1672617600, schedLead: 2 }],
        statusChange: [],
        applications: [],
        unreadMessages: []
    },
    102: {
        dials: generateActivityHistory(90, 50),
        leadsPurchased: generatePurchaseHistory(90, 20),
        
        // --- ADDED MISSING AGGREGATES ---
        totalDials: 3800,
        totalContacts: 450,
        totalApv: 9800,
        totalLeadsPurchased: 1800,
        contactRate: 11.8,
        appointmentRate: 4.2,
        // --------------------------------

        scheduled: [
            { apptTitle: 'Follow-up with Innovate Inc.', apptDate: 1672531200, apptTimezone: 'EST', apptLead: 1 },
        ],
        appointments: 5,
        scheduledCalls: [
            { schedLeadFirst: 'Tech', schedLeadLast: 'Solutions', schedTime: 1672617600, schedLead: 2 },
        ],
        statusChange: [
            { statusChangeFirst: 'Data', statusChangeLast: 'Systems', statusDate: 1672704000, statusName: 'Contacted', statusChangeLead: 3 },
        ],
        applications: [
             { statusChangeFirst: 'Creative', statusChangeLast: 'Co.', statusDate: 1672790400, statusName: 'Application Sent', statusChangeLead: 4 },
        ],
        unreadMessages: [
            { unreadLeadFirst: 'Future', unreadLeadLast: 'Forward', unreadMessageTime: 1672876800, unreadMessage: 'I am interested in learning more.', statusChangeLead: 5 }
        ]
    },
    103: { // Agent to Watch example (Low stats)
        dials: [
            ...createManualDialsForPastWeek(12, 1), 
            ...generateActivityHistory(90, 8).slice(7)
        ],
        leadsPurchased: [
            ...generatePurchaseHistory(7, 0).map(p => ({...p, count: 0})),
            ...generatePurchaseHistory(90, 2).slice(7)
        ],
        
        // --- ADDED MISSING AGGREGATES (LOW STATS) ---
        totalDials: 240,
        totalContacts: 15,
        totalApv: 1200,
        totalLeadsPurchased: 50,
        contactRate: 6.2,
        appointmentRate: 0.5,
        // --------------------------------------------

        scheduled: [],
        appointments: 1,
        scheduledCalls: [],
        statusChange: [],
        applications: [], 
        unreadMessages: [], 
    },
    105: { // High performer (High stats)
        dials: generateActivityHistory(90, 70), 
        leadsPurchased: generatePurchaseHistory(90, 25),
        
        // --- ADDED MISSING AGGREGATES (HIGH STATS) ---
        totalDials: 6200,
        totalContacts: 1100,
        totalApv: 28500,
        totalLeadsPurchased: 2250,
        contactRate: 17.7,
        appointmentRate: 8.5,
        // ---------------------------------------------

        scheduled: [],
        appointments: 8,
        scheduledCalls: [],
        statusChange: [], 
        applications: [], 
        unreadMessages: [],
    },
    106: {
        dials: generateActivityHistory(90, 35),
        leadsPurchased: generatePurchaseHistory(90, 10),
        
        // --- ADDED MISSING AGGREGATES ---
        totalDials: 2900,
        totalContacts: 320,
        totalApv: 7500,
        totalLeadsPurchased: 900,
        contactRate: 11.0,
        appointmentRate: 2.1,
        // --------------------------------

        scheduled: [],
        appointments: 2,
        scheduledCalls: [],
        statusChange: [], 
        applications: [], 
        unreadMessages: [], 
    }
};

export const emptyAgentActivity: AgentActivity = {
    dials: [],
    // Added missing numeric fields
    totalDials: 0,
    totalContacts: 0,
    totalApv: 0,
    totalLeadsPurchased: 0,
    contactRate: 0,
    appointmentRate: 0,
    
    scheduled: [],
    appointments: 0,
    scheduledCalls: [],
    statusChange: [],
    applications: [],
    unreadMessages: [],
    leadsPurchased: [],
};


// Marketplace Mock Data
export const mockPaymentMethods: PaymentMethod[] = [
    { id: 'pm_1', cardType: 'Visa', last4: '4242', is_default:true },
    { id: 'pm_2', cardType: 'Mastercard', last4: '5555',is_default:false },
];

export const mockLeadVendors: LeadVendor[] = [
    {
        id: 'vendor_1',
        name: 'Prime Leads Co.',
        logoUrl: 'https://picsum.photos/seed/vendor1/100',
        userRating: 4.8,
        description: 'High-quality, exclusive final expense leads delivered in real-time.',
        products: [
            { id: 'prod_1a', name: 'Premium Final Expense', type: 'Final Expense', description: 'Exclusive, real-time leads.', pricePerLead: 35, minQuantity: 50, minStates: 1, platformCloseRate: 0.12 },
            { id: 'prod_1b', name: 'Aged Final Expense', type: 'Final Expense', description: 'Cost-effective leads, 90+ days old.', pricePerLead: 5, minQuantity: 200, minStates: 3, platformCloseRate: 0.04 },
        ]
    },
    {
        id: 'vendor_2',
        name: 'Lead Gen Bros',
        logoUrl: 'https://picsum.photos/seed/vendor2/100',
        userRating: 4.5,
        description: 'Affordable and reliable mortgage protection leads with fast delivery.',
        products: [
            { id: 'prod_2a', name: 'Mortgage Protection', type: 'Mortgage Protection', description: 'Direct mail and Facebook-generated.', pricePerLead: 45, minQuantity: 25, minStates: 1, platformCloseRate: 0.15 },
        ]
    },
    {
        id: 'vendor_3',
        name: 'Market Masters',
        logoUrl: 'https://picsum.photos/seed/vendor3/100',
        userRating: 4.2,
        description: 'Specializing in advanced market and high-net-worth individuals.',
        products: [
            { id: 'prod_3a', name: 'Annuity Leads', type: 'Advanced Market', description: 'Qualified prospects interested in annuities.', pricePerLead: 150, minQuantity: 10, minStates: 1, platformCloseRate: 0.18 },
        ]
    }
];

export const mockMarketplaceScripts: MarketplaceItem[] = [
    { id: 'script_1', type: 'script', name: 'Ultimate Closer Script', author: 'Jane Smith', rating: 4.9, price: 25, description: 'A proven script for handling common objections and closing more deals. Focuses on a consultative approach.'},
    { id: 'script_2', type: 'script', name: 'Initial Contact Script', author: 'Admin', rating: 4.5, price: 'free', description: 'A simple and effective script for the first call with a new lead. Builds rapport quickly.'},
];

export const mockMarketplaceWorkflows: MarketplaceItem[] = [
    { id: 'wf_1', type: 'workflow', name: 'New Lead Nurture', author: 'Admin', rating: 4.7, price: 'free', description: 'A 5-step text and email cadence to warm up new leads.', purchaseCount: 125, messageCount: 5, durationDays: 7 },
    { id: 'wf_2', type: 'workflow', name: 'Long-Term Follow-up', author: 'John Doe', rating: 4.6, price: 15, description: 'Keep in touch with prospects over 6 months with this automated workflow.', purchaseCount: 42, messageCount: 8, durationDays: 180 },
];

export const mockMarketplaceServices: MarketplaceItem[] = [
    {
        id: 'service_1',
        type: 'service',
        name: 'Real-Time Live Transfers',
        author: 'Funnel Platform',
        rating: 5,
        price: 'free', // The opt-in is free, the connection has a fee
        description: 'Opt-in to receive pre-qualified, inbound callers transferred directly to your line. A fee of $25 is charged per successful connection.',
    },
    {
        id: 'service_2',
        type: 'service',
        name: 'Recruiting Power Pack',
        author: 'Funnel Platform',
        rating: 5,
        price: 200,
        description: 'Unlock the full recruiting suite, including a customizable pipeline, job post management, and automation tools. Billed monthly.',
    }
];

export const mockOrders: Order[] = [
    {
        id: 'order_1',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        total: 1750,
        items: [
            { productId: 'prod_1a', productName: 'Premium Final Expense', pricePerItem: 35, quantity: 50, fulfilledQuantity: 25 }
        ],
        paymentMethodId: 'pm_1',
        paymentMethodCardType: 'Visa',
        paymentMethodLast4: '4242'
    },
    {
        id: 'order_2',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        total: 25,
        items: [
            { productId: 'script_1', productName: 'Ultimate Closer Script', pricePerItem: 25, quantity: 1 }
        ],
        paymentMethodId: 'pm_2',
        paymentMethodCardType: 'Mastercard',
        paymentMethodLast4: '5555'
    },
    {
        id: 'order_3',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        total: 0,
        items: [
            { productId: 'wf_1', productName: 'New Lead Nurture', pricePerItem: 0, quantity: 1 }
        ]
    }
];

// FIX: Changed 'name' property to 'title' to match the TextTemplate interface.
export const mockTextTemplates: TextTemplate[] = [
    { id: 'txt_1', title: 'Appointment Reminder', content: 'Hi [FirstName], this is a friendly reminder for your appointment tomorrow at [AppointmentTime]. We look forward to speaking with you!', category: 'Reminders', created: 1672531200 },
    { id: 'txt_2', title: 'Quick Follow-up', content: 'Hey [FirstName], just checking in. Let me know if you have any questions about what we discussed. Thanks, [AgentFirstName].', category: 'Follow-up', created: 1672617600 },
    // FIX: Completed the object definition which was causing a syntax error.
    { id: 'txt_3', title: 'Happy Birthday!', content: 'Happy birthday, [FirstName]! Hope you have a great day.', category: 'Relationship', imageUrl: 'https://picsum.photos/seed/birthday/300/200', created: 1672704000 },
    { id: 'txt_4', title: 'No Answer Voicemail', content: 'Hi [FirstName], sorry I missed you. I just left you a voicemail. Please give me a call back at [AgentPhone] when you have a moment.', category: 'Follow-up', created: 1672790400 },
    { id: 'txt_5', title: 'Policy Info Request', content: 'Hi [FirstName], per your request, here is some information about the policy we discussed. Please review and let me know if you have any questions.', category: 'Information', created: 1672876800 },
    { id: 'txt_recruit_1', title: 'Recruit: Initial Outreach', content: 'Hi [FirstName], I saw your profile and was impressed with your background. Are you open to learning about a new opportunity? Thanks, [AgentFirstName].', category: 'Recruiting', created: 1672963200 },
    { id: 'txt_recruit_2', title: 'Recruit: Nudge', content: 'Hi [FirstName], just wanted to follow up and see if you had any questions about the opportunity. Thanks, [AgentFirstName].', category: 'Recruiting', created: 1673049600 },
];

export const mockEmailTemplates: EmailTemplate[] = [
    {
        id: 'email_1',
        name: 'Initial Welcome',
        subject: 'Welcome to the Team, [FirstName]!',
        content: '<h1>Welcome!</h1><p>Hi [FirstName], we are so excited to have you. Here is some initial info...</p>',
        category: 'Onboarding',
        created: 1672531200,
        attachments: [{ url: 'https://example.com/onboarding_guide.pdf', filename: 'Onboarding_Guide.pdf', mimeType: 'application/pdf' }]
    },
    {
        id: 'email_2',
        name: 'Product Info Sheet',
        subject: 'Information on [Product Name]',
        content: '<p>Hello [FirstName],</p><p>As requested, here is the information on our product. Please let me know if you have any questions.</p><p>Thanks,<br/>[AgentFirstName]</p>',
        category: 'Information',
        created: 1672617600,
        attachments: [{ url: 'https://example.com/product_info.jpg', filename: 'Product_Info.jpg', mimeType: 'image/jpeg' }]
    },
    {
        id: 'email_3',
        name: 'Meeting Follow-Up',
        subject: 'Following up on our conversation',
        content: '<p>Great speaking with you today, [FirstName]. Looking forward to our next steps.</p>',
        category: 'Follow-up',
        created: 1672704000,
        attachments: []
    },
];


export const mockWorkflows: Workflow[] = [
    {
        id: 'wf_1',
        name: 'New Lead Nurture Sequence',
        enabled: true,
        steps: [
            { id: 'step_1', type: 'wait', name: 'Wait 5 Minutes', config: { duration: 5, unit: 'minutes' } },
            { id: 'step_2', type: 'send-text', name: 'Send: Quick Follow-up', config: { templateId: 'txt_2' } },
            { id: 'step_3', type: 'wait', name: 'Wait 1 Day', config: { duration: 1, unit: 'days' } },
            { id: 'step_4', type: 'send-text', name: 'Send: No Answer Voicemail text', config: { templateId: 'txt_4' } },
        ],
        triggers: [
            { type: 'status-change', ids: [1] } // "New Lead" status
        ],
        exitConditions: [
            { type: 'on-response' },
            { type: 'status-change', ids: [5, 6] } // "Sold" or "Do Not Call"
        ],
        stats: { active: 12, completed: 45 }
    },
    {
        id: 'wf_2',
        name: 'Long Term Nurture',
        enabled: false,
        steps: [
            { id: 'step_5', type: 'wait', name: 'Wait 30 Days', config: { duration: 30, unit: 'days' } },
            { id: 'step_6', type: 'send-text', name: 'Send: Follow-up', config: { templateId: 'txt_2' } },
            { id: 'step_7', type: 'add-tag', name: 'Add Tag: Long Term', config: { tagId: 'tag_7' } },
        ],
        triggers: [
            { type: 'tag-added', ids: ['tag_7'] }
        ],
        exitConditions: [
            { type: 'on-response' }
        ],
        stats: { active: 5, completed: 8 }
    },
];

export const mockWorkflowEnrollments: WorkflowEnrollment[] = [
    { enrollmentId: 'enr_1', leadId: '1', workflowId: 'wf_1', currentStepId: 'step_2', enrolledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { enrollmentId: 'enr_2', leadId: '2', workflowId: 'wf_1', currentStepId: 'step_4', enrolledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { enrollmentId: 'enr_3', leadId: '3', workflowId: 'wf_1', currentStepId: 'step_2', enrolledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { enrollmentId: 'enr_4', leadId: '4', workflowId: 'wf_2', currentStepId: 'step_6', enrolledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { enrollmentId: 'enr_5', leadId: '5', workflowId: 'wf_1', currentStepId: 'step_1', enrolledDate: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
];

export const LEAD_FIELDS_FOR_MAPPING = [
  { value: 'borrower_first', label: 'First Name', group: 'Primary Contact' },
  { value: 'borrower_last', label: 'Last Name', group: 'Primary Contact' },
  { value: 'borrower_dob', label: 'Date of Birth', group: 'Primary Contact' },
  { value: 'borrower_age', label: 'Age', group: 'Primary Contact' },
  { value: 'borrower_home', label: 'Home Phone', group: 'Primary Contact' },
  { value: 'borrower_cell', label: 'Cell Phone', group: 'Primary Contact' },
  { value: 'borrower_work', label: 'Work Phone', group: 'Primary Contact' },
  { value: 'email', label: 'Email', group: 'Primary Contact' },
  { value: 'tobacco', label: 'Tobacco User', group: 'Primary Contact' },

  { value: 'co_borrower_first', label: 'Co-Borrower First Name', group: 'Co-Borrower' },
  { value: 'co_borrower_last', label: 'Co-Borrower Last Name', group: 'Co-Borrower' },

  { value: 'address', label: 'Street Address', group: 'Address' },
  { value: 'city', label: 'City', group: 'Address' },
  { value: 'state', label: 'State', group: 'Address' },
  { value: 'zip', label: 'Zip Code', group: 'Address' },
  { value: 'county', label: 'County', group: 'Address' },

  { value: 'lead_status', label: 'Status', group: 'Lead Info' },
  { value: 'lead_type', label: 'Type', group: 'Lead Info' },
  { value: 'notes', label: 'Notes', group: 'Lead Info' },
  { value: 'tags', label: 'Tags (comma-separated)', group: 'Lead Info' },
  { value: 'vendor', label: 'Vendor', group: 'Lead Info' },

  { value: 'mortgage', label: 'Mortgage Amount', group: 'Financial' },
  { value: 'lender', label: 'Lender', group: 'Financial' },
  { value: 'home_value', label: 'Home Value', group: 'Financial' },
  { value: 'household_income', label: 'Household Income', group: 'Financial' },
];

export const mockTrainingResources: TrainingResource[] = [
  { id: 'vid_1', type: 'video', title: 'Mastering the Opening', description: 'Learn how to effectively start a conversation with any lead type.', category: 'Sales Techniques', contentUrl: 'https://www.youtube.com/embed/g4R5w_o3-2s', thumbnailUrl: 'https://i.ytimg.com/vi/g4R5w_o3-2s/hqdefault.jpg' },
  { id: 'art_1', type: 'article', title: 'Top 5 Objection Handlers', description: 'A deep dive into common objections and how to overcome them with confidence.', category: 'Objection Handling', contentUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/article1/300/200' },
  { id: 'pdf_1', type: 'pdf', title: 'Final Expense Product Guide', description: 'Download the complete guide to our Final Expense products and offerings.', category: 'Product Knowledge', contentUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pdf1/300/200' },
  { id: 'vid_2', type: 'video', title: 'Closing the Deal', description: 'Techniques to effectively close deals and secure appointments.', category: 'Sales Techniques', contentUrl: 'https://www.youtube.com/embed/I4svSeCMw-g', thumbnailUrl: 'https://picsum.photos/seed/vid2/300/200' },
  { id: 'art_2', type: 'article', title: 'Building Rapport Over Text', description: 'Learn the art of creating connections through text messaging.', category: 'Communication', contentUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/article2/300/200' },
];

export const mockBadges: Badge[] = [
  { id: 'badge_1', name: 'Appointment Setter', description: 'Successfully set an appointment in a simulation.', icon: 'calendar-clock', earned: true },
  { id: 'badge_2', name: 'Objection Overcomer', description: 'Successfully handled 3 objections in a row.', icon: 'q-switch-vertical', earned: true },
  { id: 'badge_3', name: 'Tough Negotiator', description: 'Handled a "Difficult" persona from start to finish.', icon: 'q-award-medal', earned: false },
  { id: 'badge_4', name: 'Texting Pro', description: 'Completed 5 text simulations.', icon: 'message-circle-q', earned: false },
  { id: 'badge_5', name: 'Phone Ace', description: 'Completed 5 call simulations.', icon: 'q-phone-call', earned: false },
  { id: 'badge_6', name: 'Certified: Final Expense', description: 'Completed all Final Expense training modules.', icon: 'checkmark-q', earned: false },
];

export const mockSimulationHistory: SimulationHistory[] = [
    {
        id: 'sim_1',
        type: 'Text',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        scenario: { leadType: 'Final Expense', persona: 'Skeptical' },
        rating: 'Good',
        transcript: [
            { speaker: 'bot', text: 'Hello?' },
            { speaker: 'user', text: 'Hi Alex, this is John from Senior Life. I was hoping to talk to you about final expense insurance.' },
            { speaker: 'bot', text: 'I don\'t think I need that.' },
            { speaker: 'user', text: 'I understand, many people feel that way at first. It\'s really about protecting your loved ones from future costs. Do you have a few minutes?' },
            { speaker: 'bot', text: 'I\'m busy.' },
        ],
        feedback: "Rating: Good\n\nYou did a good job acknowledging the client's initial objection and pivoting to the value proposition. Your tone was professional. \n\nArea for improvement: When the client said they were busy, you could have tried to schedule a specific time to call back instead of leaving it open-ended. For example: 'No problem, would tomorrow at 2 PM work better for you?'"
    },
    {
        id: 'sim_2',
        type: 'Call',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        scenario: { leadType: 'Mortgage Protection', persona: 'Friendly' },
        rating: 'Excellent',
        transcript: [
            { speaker: 'agent', text: 'Hi, is this Alex?' },
            { speaker: 'client', text: 'Yes, it is.' },
            { speaker: 'agent', text: 'Hi Alex, my name is John with the Mortgage Protection Center. How are you today?' },
            { speaker: 'client', text: 'I\'m doing well, thanks! How about you?' },
            { speaker: 'agent', text: 'I\'m great, thanks for asking! The reason for my call is regarding your recent mortgage inquiry. We help homeowners ensure their family can keep their home if something unexpected happens. It only takes a few minutes to see what that would look like for you.' },
            { speaker: 'client', text: 'Oh, okay. I\'m not sure I can afford anything extra right now.' },
            { speaker: 'agent', text: 'I totally get that, and that\'s exactly why I\'m calling. Our job is to find something that fits comfortably within your budget. It\'s more affordable than most people think. What\'s a good time for us to quickly go over the options?' }
        ],
        feedback: "Rating: Excellent\n\nFantastic work building rapport with the friendly persona. Your opening was smooth and you transitioned to the value proposition clearly. Your handling of the price objection was textbook perfect - you validated their concern and then turned it into a reason to continue the conversation. Keep up the great work!"
    },
    {
        id: 'sim_3',
        type: 'Text',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        scenario: { leadType: 'Annuity', persona: 'Difficult' },
        rating: 'Needs Improvement',
        transcript: [
            { speaker: 'bot', text: 'Who is this?' },
            { speaker: 'user', text: 'This is John.' },
            { speaker: 'bot', text: 'John who?' },
            { speaker: 'user', text: 'John from the retirement planning group. You inquired about annuities.' },
            { speaker: 'bot', text: 'Stop texting me.' },
        ],
        feedback: "Rating: Needs Improvement\n\nThe interaction was very short. Your initial response 'This is John' lacked context and professionalism. Always introduce yourself fully, including your company name. When the client asked to stop, the conversation ended. While you must respect their wishes, the goal here is to practice. You could have tried one more gentle attempt, such as: 'My apologies, I have you on our list from an online inquiry. I will remove you now. Have a great day.' This ends the conversation professionally."
    },
];

// Recruiting Mock Data
export const mockRecruits: Recruit[] = [
  { id: 'rec_1', name: 'Samantha Carter', email: 's.carter@example.com', phone: '555-1111', stage: 'new-lead', applyDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), source: 'LinkedIn', state: 'CO', hasLicense: true, licensedStates: 'CO, UT, WY', notes: 'Met at a networking event. Very sharp.' },
  { id: 'rec_2', name: 'Daniel Jackson', email: 'd.jackson@example.com', phone: '555-2222', stage: 'contacted', applyDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), source: 'Referral', state: 'NM', hasLicense: false, licensedStates: '', notes: 'Responded to LinkedIn message. Needs to get licensed.' },
  { id: 'rec_3', name: 'Jack O\'Neill', email: 'j.oneill@example.com', phone: '555-3333', stage: 'interviewing', applyDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), source: 'Indeed', state: 'CA', hasLicense: true, licensedStates: 'CA, AZ, NV', notes: 'Experienced, but seems hesitant about the commission structure.' },
  { id: 'rec_4', name: 'Teal\'c', email: 'tealc@example.com', phone: '555-4444', stage: 'onboarding', applyDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), source: 'Website', state: 'TX', hasLicense: true, licensedStates: 'TX', notes: 'Strong personality. Great potential.' },
  { id: 'rec_5', name: 'George Hammond', email: 'g.hammond@example.com', phone: '555-5555', stage: 'contracted', applyDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), source: 'Internal', state: 'DC', hasLicense: true, licensedStates: 'All 50', notes: 'Veteran in the industry. Great addition to the team.' },
  { id: 'rec_6', name: 'Janet Fraiser', email: 'j.fraiser@example.com', phone: '555-6666', stage: 'contacted', applyDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), source: 'LinkedIn', state: 'FL', hasLicense: false, licensedStates: '', notes: 'Career changer. Eager to learn.' },
];

export const mockRecruitingPipelines: RecruitingPipeline[] = [
    {
        id: 'pipe_1',
        name: 'Default Pipeline',
        stages: [
            { id: 'new-lead', title: 'New Lead', automations: [] },
            { id: 'contacted', title: 'Contacted', automations: [] },
            { id: 'interviewing', title: 'Interviewing', automations: [] },
            { id: 'onboarding', title: 'Onboarding', automations: [{ id: 'auto_1', action: 'send-packet', targetId: 'pack_1' }, { id: 'auto_2', action: 'send-text', targetId: 'txt_recruit_1'}] },
            { id: 'contracted', title: 'Contracted', automations: [] },
        ]
    },
    {
        id: 'pipe_2',
        name: 'Focused Pipeline',
        stages: [
            { id: 'new-lead', title: 'New Lead', automations: [] },
            { id: 'interviewing', title: 'Interviewing', automations: [] },
            { id: 'contracted', title: 'Contracted', automations: [] },
        ]
    }
];

export const mockRecruitingResources: RecruitingResource[] = [
    { id: 'res_1', type: 'video', title: 'Our Agency Culture', description: 'A look inside what makes our team special.', category: 'Culture', contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/recres1/300/200' },
    { id: 'res_2', type: 'document', title: 'Compensation Plan Overview', description: 'Download the detailed PDF explaining our competitive compensation.', category: 'Compensation', contentUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/recres2/300/200' },
    { id: 'res_3', type: 'script', title: 'Initial Contact Script for Recruits', description: 'A proven script to start the conversation with potential recruits.', category: 'Scripts', contentUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/recres3/300/200' },
];

export const mockResourcePackets: ResourcePacket[] = [
    { id: 'pack_1', name: 'Onboarding Documents', resourceIds: ['res_2'] },
    { id: 'pack_2', name: 'Initial Outreach Kit', resourceIds: ['res_1', 'res_3'] },
];

export const mockJobPostTemplates: JobPostTemplate[] = [
    { id: 'jpt_1', title: 'Experienced Sales Agent (Remote)', content: 'We are seeking a motivated and experienced sales agent to join our remote team. The ideal candidate will have a proven track record in the insurance industry and a passion for helping clients. Responsibilities include... Contact [Agent Name] at [Agent Phone] or visit [Agency Website] to apply.', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'jpt_2', title: 'Entry-Level Agent - Training Provided', content: 'Ready for a new career? We provide full training and support for individuals looking to enter the lucrative insurance market. No experience necessary, just a drive to succeed. Learn more and apply today at [Agency Website]!', lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

export const mockRecruitingBadges: RecruitingBadge[] = [
  { id: 'rb_1', name: 'First Contract', description: 'Sign your first contracted agent.', icon: 'q-award-medal', earned: true, viewed: true },
  { id: 'rb_2', name: 'Team Builder', description: 'Contract 5 new agents.', icon: 'q-award-trophy', earned: true, viewed: true },
  { id: 'rb_3', name: 'Recruiting Pro', description: 'Contract 10 new agents in a single month.', icon: 'q-summit-icon', earned: false, viewed: true },
  { id: 'rb_4', name: 'Master Recruiter', description: 'Grow your downline to 25 total agents.', icon: 'q-summit-icon-select', earned: false, viewed: true },
  { id: 'rb_5', name: 'Fast Starter', description: 'Move a recruit from New Lead to Contracted in under 14 days.', icon: 'q-lightning-bolt-fast', earned: false, viewed: true },
];

export const messageVariables: string[] = [
    'FirstName', 'LastName', 'Email', 'Phone',
    'AgentFirstName', 'AgentLastName', 'AgentPhone',
];

export const scriptVariables: { label: string; value: string }[] = [
    { label: "First Name", value: "FirstName" },
    { label: "Last Name", value: "LastName" },
    { label: "Lead Type", value: "Lead_Type" },
    { label: "Beneficiary", value: "Beneficiary_Name" },
    { label: "Mortgage Amount", value: "Lead_MortgageAmount" },
    { label: "Agent First Name", value: "Agent_FirstName" },
    { label: "Agent Last Name", value: "Agent_LastName" },
    { label: "Co-Borrower First Name", value: "CoBorrower_FirstName" },
    { label: "Has Existing Insurance", value: "Has_Insurance" },
    { label: "Lead Status", value: "Lead_Status" },
    { label: "Lead City", value: "Lead_City" },
];

export const mockScripts: Script[] = [
    {
        id: 'script_1',
        name: 'Standard MP Opening',
        category: 'Opening',
        content: "Hello, [FirstName]? This is [AgentFirstName] [Agent_LastName], the Field Underwriter assigned to your mortgage protection request. I just need to verify some info to get you those options. You listed your mortgage as $[Lead_MortgageAmount], is that correct?\n\n[[IF:CoBorrower_FirstName:PRESENT]]\nGreat, and is [CoBorrower_FirstName] available as well?\n[[ENDIF]]",
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'script_2',
        name: 'FE Closing Script',
        category: 'Closing',
        content: "Based on our conversation, Option B seems to fit your budget and needs perfectly. It provides [[SELECT:CoverageAmount:10000,15000,20000]] for [Beneficiary_Name]. All we need to do is submit the application to see if we can get you approved. What is their exact Date of Birth? [[INPUT:Beneficiary_DOB]] Sound fair enough?\n\n[[IF:Has_Insurance:EQ:yes]]\nGreat, let's talk about how this new policy will integrate with your existing coverage.\n[[ELSE]]\nPerfect, this will be your first policy then.\n[[ENDIF]]\n\n[[OBJECTION:obj_1]]",
        lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const mockObjections: Objection[] = [
    { id: 'obj_1', title: 'Price is too high', solution: 'I understand your concern about the price. Many people feel that way at first, but let\'s look at the value you\'re getting for that investment. This policy is designed to protect your family\'s future, ensuring they won\'t face financial hardship during a difficult time. We can adjust coverage to fit different budgets. What kind of payment were you hoping for?', lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'obj_2', title: 'I need to think about it', solution: 'I completely understand. This is an important decision. To help you think it over, what specifically about the plan gives you pause? Is it the coverage, the payments, or something else? I want to make sure all your questions are answered now so you can make a confident decision.', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'obj_3', title: 'I already have insurance', solution: 'That\'s great to hear you\'re proactive about protecting your family! Many of my clients have existing coverage. Often, what we find is that their current policy might not be enough to cover all final expenses, or it might not provide living benefits. When was the last time you reviewed your policy? I can quickly show you how our plan might complement what you already have.', lastUpdated: new Date().toISOString() },
];


// --- Conversations Mock Data ---
export const mockSalesConversations: Conversation[] = [
    {
        id: 'conv_sales_1',
        type: 'Sales',
        contactId: '1',
        contactName: 'John Doe',
        contactAvatarUrl: 'https://picsum.photos/seed/1/100',
        lastMessage: 'Great, thank you for the information!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        contactStatus: 'Qualified',
        messages: [
            { id: 'm1', text: 'Hi John, this is [Agent Name] from Funnel CRM following up on your inquiry.', sender: 'agent', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString() },
            { id: 'm2', text: 'Hello! Yes, I was looking for some more information on the premium plan.', sender: 'contact', timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000).toISOString() },
            { id: 'm3', text: 'Great, thank you for the information!', sender: 'contact', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        ]
    },
    {
        id: 'conv_sales_2',
        type: 'Sales',
        contactId: '2',
        contactName: 'Jane Smith',
        contactAvatarUrl: '', // No avatar to test fallback
        lastMessage: 'Can we schedule a call for tomorrow at 2 PM?',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        unreadCount: 1,
        contactStatus: 'Contacted',
        messages: [
             { id: 'm4', text: 'Can we schedule a call for tomorrow at 2 PM?', sender: 'contact', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        ]
    },
];

export const mockRecruitingConversations: Conversation[] = [
    {
        id: 'conv_rec_1',
        type: 'Recruiting',
        contactId: 'rec_2',
        contactName: 'Daniel Jackson',
        contactAvatarUrl: '', // No avatar to test fallback
        lastMessage: 'Yes, I\'d be interested in learning more about the opportunity.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        unreadCount: 1,
        contactStage: 'Contacted',
        messages: [
            { id: 'm5', text: 'Hi Daniel, I came across your profile and was impressed. Are you open to new opportunities?', sender: 'agent', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
            { id: 'm6', text: 'Yes, I\'d be interested in learning more about the opportunity.', sender: 'contact', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
        ]
    },
];

// --- Warm Market Mock Data ---
export const mockWarmMarketContacts: WarmMarketContact[] = [
  { id: 1001, fullName: 'Aunt May Parker', phone: '555-0101', email: 'may.p@example.com', company: '', location: 'New York, NY', importDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), suggestion: 'Friend', status: 'pending' },
  { id: 1002, fullName: 'Barry Allen', phone: '555-0102', company: 'Central City Police', location: 'Central City, MO', importDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 1003, fullName: 'Charles Xavier', phone: '555-0103', email: 'prof.x@example.com', company: 'Xavier\'s School', location: 'Westchester, NY', importDate: new Date().toISOString(), suggestion: 'Recruiter', status: 'pending' },
  { id: 1004, fullName: 'Diana Prince', phone: '555-0104', company: 'Themyscira Exports', location: 'New York, NY', importDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 1005, fullName: 'Edward Nygma', phone: '555-0105', email: 'riddler@example.com', company: 'Acme Company', location: 'Gotham, NJ', importDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 1006, fullName: 'Frank Castle', phone: '555-0106', company: 'Acme Company', location: 'New York, NY', importDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 1007, fullName: 'Gwen Stacy', phone: '555-0107', email: 'gwen.s@example.com', company: 'Oscorp', location: 'New York, NY', importDate: new Date().toISOString(), suggestion: 'Insurance Sales', status: 'pending' },
  { id: 1008, fullName: 'Hal Jordan', phone: '555-0108', company: 'Ferris Aircraft', location: 'Coast City, CA', importDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 1009, fullName: 'Iris West', phone: '555-0109', company: 'Picture News', location: 'Central City, MO', importDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  { id: 1010, fullName: 'John Stewart', phone: '555-0110', company: 'Acme Company', location: 'Detroit, MI', importDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
  // Pre-categorized contacts
  { id: 1011, fullName: 'Clark Kent', phone: '555-0111', email: 'clark@dailyplanet.com', company: 'Daily Planet', location: 'Metropolis, DE', importDate: new Date().toISOString(), status: 'categorized', category: 'insurance' },
  { id: 1012, fullName: 'Lois Lane', phone: '555-0112', email: 'lois@dailyplanet.com', company: 'Daily Planet', location: 'Metropolis, DE', importDate: new Date().toISOString(), status: 'categorized', category: 'insurance' },
  { id: 1013, fullName: 'Bruce Wayne', phone: '555-0113', email: 'bruce@wayne.com', company: 'Wayne Enterprises', location: 'Gotham, NJ', importDate: new Date().toISOString(), status: 'categorized', category: 'advanced_market' },
];

// Agent-to-Agent Chat Mock Data
export const mockAgentConversations: AgentConversation[] = [
    {
        id: '101-105',
        participantIds: [101, 105],
        messages: [
            { id: 'ag_msg_1', senderId: 105, text: 'Hey, did you see the memo about the new comp plan?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: 'ag_msg_2', senderId: 101, text: 'Yeah, just read it. Looks interesting!', timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString() },
        ]
    },
    {
        id: '101-106',
        participantIds: [101, 106],
        messages: [
            { id: 'ag_msg_3', senderId: 106, text: 'Got a minute to chat about that lead from yesterday?', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        ]
    }
];

export const DEFAULT_SMART_LIST_RULES: SmartListRule[] = [
    {
        id: 'NEVER_CONTACTED',
        label: 'Never Contacted',
        description: 'Leads that have 0 contact attempts.',
        enabled: true,
        config: {}
    },
    {
        id: 'LAST_CONTACTED_DAYS',
        label: 'Last Contacted',
        description: 'Prioritize leads not contacted recently.',
        enabled: true,
        config: { operator: 'gt', value: 7 } // 'gt' for "greater than" 7 days
    },
    {
        id: 'LEAD_LEVEL',
        label: 'Lead Level',
        description: 'Prioritize leads with specific levels.',
        enabled: true,
        config: { values: ['Hot'] } // Default to 'Hot'
    },
    {
        id: 'STATUS',
        label: "Status",
        description: 'Prioritize leads with specific statuses.',
        enabled: true,
        config: { values: [1] } // 'New' has id 1 in mockAppInfo
    },
    {
        id: 'CONTACT_ATTEMPTS',
        label: 'Contact Attempts',
        description: 'Prioritize leads with fewer contact attempts.',
        enabled: false,
        config: { operator: 'lt', value: 3 } // 'lt' for "less than" 3
    },
    {
        id: 'LEAD_AGE',
        label: 'Lead Age',
        description: 'Prioritize leads of a certain age.',
        enabled: false,
        config: { operator: 'eq', value: 35 } // Default to 'equals' 35
    }
];

// New: Mock Stripe Subscriptions for the Subscription Page
export const mockStripeSubscriptions: StripeSubscription[] = [
    {
        id: 'sub_1',
        customer_id: 'cus_abc123',
        description: 'Base CRM Access',
        status: 'active',
        quantity: 1,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        current_period_end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        cancel_at_period_end: false,
        cancel_at: null,
        plan: {
            id: 'price_crm_base',
            name: 'CRM Base Seat',
            amount: 9900,
            currency: 'usd',
            interval: 'month',
            interval_count: 1,
            description: 'Core CRM functionality for one agent seat.',
        },
        balance_due: 0,
    },
    {
        id: 'sub_2',
        customer_id: 'cus_abc123',
        description: 'Recruiting Power Pack Add-on',
        status: 'active',
        quantity: 1,
        start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        cancel_at_period_end: false,
        cancel_at: null,
        plan: {
            id: 'price_recruiting_addon',
            name: 'Recruiting Module',
            amount: 20000,
            currency: 'usd',
            interval: 'month',
            interval_count: 1,
            description: 'Full suite of recruiting tools.',
        },
        balance_due: 0,
    },
    {
        id: 'sub_3',
        customer_id: 'cus_abc123',
        description: 'Legacy Plan (Cancelled)',
        status: 'canceled',
        quantity: 1,
        start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        current_period_end: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (ended)
        cancel_at_period_end: true,
        cancel_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        plan: {
            id: 'price_legacy_old',
            name: 'Old Standard Plan',
            amount: 5000,
            currency: 'usd',
            interval: 'month',
            interval_count: 1,
        },
        balance_due: 0,
    },
    {
        id: 'sub_4',
        customer_id: 'cus_abc123',
        description: 'Paused Live Transfers',
        status: 'paused', // New: status is paused
        quantity: 1,
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        paused_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // New: paused 5 days ago
        current_period_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
        cancel_at_period_end: false,
        cancel_at: null,
        plan: {
            id: 'price_live_transfers',
            name: 'Live Transfers Service',
            amount: 0, // Billed per transfer, not monthly
            currency: 'usd',
            interval: 'month',
            interval_count: 1,
            description: 'Opt-in for real-time lead transfers.',
        },
        balance_due: 0,
    },
    {
        id: 'sub_5',
        customer_id: 'cus_abc123',
        description: 'Late Payment Alert',
        status: 'past_due',
        quantity: 1,
        start_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
        current_period_end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (past due)
        cancel_at_period_end: false,
        cancel_at: null,
        plan: {
            id: 'price_crm_advanced',
            name: 'CRM Advanced Seat',
            amount: 19900,
            currency: 'usd',
            interval: 'month',
            interval_count: 1,
            description: 'Advanced CRM features and analytics.',
        },
        balance_due: 19900, // Balance due in cents
    },
];

// New: Mock Usage Data
export const mockUsageData: UsageRecord = {
    id: 'usage_current_period',
    billingPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    billingPeriodEnd: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    textMessagesSent: 1532,
    callsMade: 876,
    leadsPurchased: 250,
    // Add other usage metrics as needed
};

// New: Mock Lead Notes
export const mockLeadNotes: LeadNote[] = [
    { id: 'ln_1', lead_id: '1', content: 'Initial call, client interested in FE. Schedule follow-up for next week.', created_at: '2024-07-28T10:30:00Z', agent_name: 'John Doe' },
    { id: 'ln_2', lead_id: '1', content: 'Sent brochure via email. No response yet.', created_at: '2024-07-29T14:00:00Z', agent_name: 'John Doe' },
    { id: 'ln_3', lead_id: '2', content: 'Left voicemail, no callback. Will try again Tuesday.', created_at: '2024-07-29T15:00:00Z', agent_name: 'Jane Smith' },
];

// New: Mock Lead Files
export const mockLeadFiles: LeadFile[] = [
    { id: 'lf_1', lead_id: '1', file_name: 'FE_Brochure_V2.pdf', file_url: '/files/FE_Brochure_V2.pdf', file_type: 'application/pdf', uploaded_at: '2024-07-28T11:00:00Z', agent_name: 'John Doe' },
    { id: 'lf_2', lead_id: '1', file_name: 'Client_Photo_ID.jpg', file_url: '/files/Client_Photo_ID.jpg', file_type: 'image/jpeg', uploaded_at: '2024-07-29T09:00:00Z', agent_name: 'John Doe' },
    { id: 'lf_3', lead_id: '2', file_name: 'MP_Flyer.pdf', file_url: '/files/MP_Flyer.pdf', file_type: 'application/pdf', uploaded_at: '2024-07-29T16:00:00Z', agent_name: 'Jane Smith' },
];

// New: Mock Lead Qualifier Data (example for Lead 1)
export const mockLeadQualifierData: { [leadId: string]: LeadQualifierData } = {
    '1': {
        smoker: 'no',
        annualIncome: 60000,
        healthConditions: 'Controlled high blood pressure',
        desiredCoverage: 150000,
    },
};

// New: Mock Quotes (example for Lead 1)
export const mockQuotes: { [leadId: string]: Quote[] } = {
    '1': [
        { id: 'quote_1', company: 'Acme Life', coverage: '$150,000', monthly_premium: '$75.50', notes: 'Standard plan, level premium.' },
        { id: 'quote_2', company: 'Premier Insurance', coverage: '$150,000', monthly_premium: '$78.25', notes: 'Includes accidental death benefit.' },
        { id: 'quote_3', company: 'Secure Future', coverage: '$100,000', monthly_premium: '$50.00', notes: 'Budget option, guaranteed issue.' },
    ],
};


// New: Default Lead Card Layouts (for main blocks in OverviewTab)
export const DEFAULT_LEAD_LAYOUTS: LeadLayoutType = {
    default: ['lead_details', 'tags', 'activity_log', 'notes_overview', 'files_overview'],
    'Final Expense': ['lead_details', 'notes_overview', 'activity_log', 'tags', 'files_overview'],
    'Mortgage Protection': ['tags', 'lead_details', 'files_overview', 'notes_overview', 'activity_log'],
    'Advanced Market': ['files_overview', 'lead_details', 'notes_overview', 'tags', 'activity_log'],
    'Inbound': ['lead_details', 'tags', 'activity_log', 'notes_overview'],
    'Outbound': ['lead_details', 'activity_log', 'notes_overview', 'tags'],
    'Referral': ['lead_details', 'notes_overview', 'tags'],
    'Warm Market': ['lead_details', 'tags', 'notes_overview'],
};

// New: All possible fields for LeadDetailsBlock customization
export const ALL_LEAD_DETAIL_FIELDS: LeadFieldConfig[] = [
    // Primary Contact
    { id: 'borrower_first', label: 'First Name', type: 'text', group: 'Primary Contact', editable: true, required: true },
    { id: 'borrower_last', label: 'Last Name', type: 'text', group: 'Primary Contact', editable: true, required: true },
    { id: 'email', label: 'Email', type: 'email', group: 'Primary Contact', editable: true, required: false },
    { id: 'phone', label: 'Phone Number', type: 'phone', group: 'Primary Contact', editable: true, required: false },
    { id: 'dob', label: 'Date of Birth', type: 'date', group: 'Primary Contact', editable: true, required: false },
    { id: 'age', label: 'Age', type: 'number', group: 'Primary Contact', editable: false, required: false }, // Derived
    { id: 'borrower_home', label: 'Home Phone', type: 'phone', group: 'Primary Contact', editable: true, required: false },
    { id: 'borrower_cell', label: 'Cell Phone', type: 'phone', group: 'Primary Contact', editable: true, required: false },
    { id: 'borrower_work', label: 'Work Phone', type: 'phone', group: 'Primary Contact', editable: true, required: false },
    { id: 'tobacco', label: 'Tobacco User', type: 'select', group: 'Primary Contact', editable: true, required: false, options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}] },

    // Co-Borrower
    { id: 'co_borrower_first', label: 'Co-Borrower First', type: 'text', group: 'Co-Borrower', editable: true, required: false },
    { id: 'co_borrower_last', label: 'Co-Borrower Last', type: 'text', group: 'Co-Borrower', editable: true, required: false },

    // Address
    { id: 'address', label: 'Street Address', type: 'text', group: 'Address', editable: true, required: false },
    { id: 'city', label: 'City', type: 'text', group: 'Address', editable: true, required: false },
    { id: 'state', label: 'State', type: 'select', group: 'Address', editable: true, required: false, options: mockAppInfo.lead_types.map(s => ({value: s.id, label: s.name})) }, // Reusing lead_types for state options for now
    { id: 'zip', label: 'Zip Code', type: 'text', group: 'Address', editable: true, required: false },
    { id: 'county', label: 'County', type: 'text', group: 'Address', editable: true, required: false },

    // Lead Info
    { id: 'status', label: 'Status', type: 'select', group: 'Lead Info', editable: true, required: true, options: mockAppInfo.statuses.map(s => ({value: String(s.id), label: s.name})) },
    { id: 'lead_type', label: 'Lead Type', type: 'select', group: 'Lead Info', editable: true, required: true, options: mockAppInfo.lead_types.map(lt => ({value: lt.id, label: lt.name})) },
    { id: 'lead_level', label: 'Lead Level', type: 'select', group: 'Lead Info', editable: true, required: true, options: mockAppInfo.lead_levels.map(ll => ({value: ll.id, label: ll.name})) },
    { id: 'company', label: 'Company', type: 'text', group: 'Lead Info', editable: true, required: false },
    { id: 'vendor', label: 'Vendor', type: 'text', group: 'Lead Info', editable: true, required: false },
    { id: 'amount_contacted', label: 'Times Contacted', type: 'number', group: 'Lead Info', editable: false, required: false },
    { id: 'last_contacted', label: 'Last Contacted', type: 'date', group: 'Lead Info', editable: false, required: false },
    { id: 'date_assigned', label: 'Date Assigned', type: 'date', group: 'Lead Info', editable: false, required: false },

    // Financial
    { id: 'value', label: 'Lead Value', type: 'number', group: 'Financial', editable: true, required: false },
    { id: 'mortgage', label: 'Mortgage Amount', type: 'number', group: 'Financial', editable: true, required: false },
    { id: 'lender', label: 'Lender', type: 'text', group: 'Financial', editable: true, required: false },
    { id: 'home_value', label: 'Home Value', type: 'number', group: 'Financial', editable: true, required: false },
    { id: 'household_income', label: 'Household Income', type: 'number', group: 'Financial', editable: true, required: false },
];

// Default layout for fields within the LeadDetailsBlock (can be customized per lead_type)
export const DEFAULT_LEAD_DETAIL_LAYOUTS: LeadFieldLayout = {
    default: [
        'borrower_first', 'borrower_last', 'email', 'phone', 'status', 'lead_type', 'lead_level', 'dob', 'address', 'city', 'state', 'zip',
        'co_borrower_first', 'co_borrower_last', 'mortgage', 'lender', 'household_income', 'company', 'vendor', 'tobacco', 'borrower_home', 'borrower_cell', 'borrower_work',
    ],
    'Final Expense': [
        'borrower_first', 'borrower_last', 'dob', 'age', 'tobacco', 'phone', 'email',
        'status', 'lead_type', 'lead_level', 'address', 'city', 'state', 'zip', 'value'
    ],
    'Mortgage Protection': [
        'borrower_first', 'borrower_last', 'co_borrower_first', 'co_borrower_last', 'phone', 'email',
        'mortgage', 'lender', 'home_value', 'household_income', 'status', 'lead_type', 'state'
    ],
};

// New: Mock Call Recording Settings
export const mockCallRecordingSettings: CallRecordingSettings = {
  agent_id: 101, // Corresponds to mockAgentInfo.agentId
  recording_consent: 0, // Default to no consent
  record_side: 0, // Default to agent side
  record_calls: 0, // Default to select calls
};

// New: Mock Agent Call Recordings
export const mockAgentCallRecordings: AgentCallRecording[] = [
  {
    id: 'rec_call_1',
    lead_id: '1',
    leadName: 'John Doe',
    caller_number: '5550101',
    call_type: 'outgoing',
    recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 125, // seconds
    call_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    is_saved: false,
    shared_with: [],
  },
  {
    id: 'rec_call_2',
    lead_id: '2',
    leadName: 'Jane Smith',
    caller_number: '5550102',
    call_type: 'incoming',
    recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 80,
    call_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    is_saved: true,
    shared_with: [
        { method: 'email', recipient: 'manager@example.com', shared_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()}
        ]
    }
]

// Mock Data for Social Features
export const mockSocialChannels: Types.SocialChannel[] = [
    { id: 'chan_general', name: 'General', description: 'General discussion for everyone.', type: 'public', kind: 'text', lastActivity: new Date().toISOString() },
    { id: 'chan_wins', name: 'Wins', description: 'Celebrate your sales and recruiting wins!', type: 'public', kind: 'text', lastActivity: new Date(Date.now() - 3600000).toISOString() },
    { id: 'chan_leads', name: 'Leads & Marketing', description: 'Discuss lead sources and strategies.', type: 'public', kind: 'text', lastActivity: new Date(Date.now() - 86400000).toISOString() },
    { id: 'chan_bullpen', name: 'Bullpen 🔊', description: 'Hop in and hang out while dialing.', type: 'public', kind: 'voice', lastActivity: new Date().toISOString(), activeParticipants: [{id: 102, name: 'Jane Smith', avatarUrl: ''}, {id: 105, name: 'David Williams', avatarUrl: ''}] },
    { id: 'chan_leadership', name: 'Leadership', description: 'Private channel for team leaders.', type: 'private', kind: 'text', lastActivity: new Date(Date.now() - 172800000).toISOString() },
];

export const mockSocialMessages: Types.SocialMessage[] = [
    { id: 'msg_1', channelId: 'chan_general', authorId: 102, authorName: 'Jane Smith', content: 'Has anyone tried the new script?', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'msg_2', channelId: 'chan_general', authorId: 101, authorName: 'John Doe', content: 'Yes, it works great for FE leads!', timestamp: new Date(Date.now() - 7100000).toISOString() },
    { id: 'msg_3', channelId: 'chan_wins', authorId: 105, authorName: 'David Williams', content: 'Just closed a $2500 APV deal! 🚀', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

export const mockSocialPosts: Types.SocialPost[] = [
    {
        id: 'post_1',
        authorId: 101,
        authorName: 'John Doe',
        title: 'Tips for Handling "I already have insurance"',
        content: 'Here are three ways I handle this common objection...',
        category: 'Question',
        likesCount: 12,
        commentsCount: 4,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isLikedByCurrentUser: false
    },
    {
        id: 'post_2',
        authorId: 106,
        authorName: 'Chris Green',
        title: 'New Carrier Product Launch',
        content: 'Have you guys seen the new product from Mutual of Omaha? It looks competitive.',
        category: 'Announcement',
        likesCount: 8,
        commentsCount: 2,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isLikedByCurrentUser: false
    },
];

export const REQUIRED_IMPORT_FIELDS = ['borrower_first', 'borrower_last', 'borrower_cell'];

export const mockActivityData= {
  // Metric Summaries
  totalDials: 124,
  totalContacts: 18,
  totalApv: 4500,
  totalLeadsPurchased: 50,
  contactRate: 14.5,
  appointmentRate: 4.2,
  appointments: 3, // Total count

  // Dials Graph Data (Last 3 days)
  dials: [
    {
      dialDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      callsMade: "38", // Note: Type definition expects string
      contacts: 5,
      apv: 1200
    },
    {
      dialDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      callsMade: "42",
      contacts: 8,
      apv: 2100
    },
    {
      dialDate: new Date().toISOString(), // Today
      callsMade: "44",
      contacts: 5,
      apv: 1200
    }
  ],

  // Calendar Items
  scheduled: [
    {
      apptTitle: "Policy Review - Smith",
      apptDate: Date.now() + 3600000, // 1 hour from now (timestamp number)
      apptTimezone: "America/New_York",
      apptLead: 101
    },
    {
      apptTitle: "Intro Call - Johnson",
      apptDate: Date.now() + 86400000, // Tomorrow
      apptTimezone: "America/Chicago",
      apptLead: 102
    }
  ],

  // Upcoming Tasks
  scheduledCalls: [
    {
      schedLeadFirst: "Jane",
      schedLeadLast: "Doe",
      schedTime: Date.now() + 7200000, // 2 hours from now
      schedLead: 205
    }
  ],

  // Recent Activity Feed
  statusChange: [
    {
      statusChangeFirst: "Michael",
      statusChangeLast: "Scott",
      statusDate: Date.now() - 1800000, // 30 mins ago
      statusName: "Interested",
      statusChangeLead: 301
    }
  ],

  // Applications
  applications: [
    {
      statusChangeFirst: "Jim",
      statusChangeLast: "Halpert",
      statusDate: Date.now() - 43200000, // 12 hours ago
      statusName: "Submitted",
      statusChangeLead: 402
    }
  ],

  // Notifications
  unreadMessages: [
    {
      unreadLeadFirst: "Dwight",
      unreadLeadLast: "Schrute",
      unreadMessageTime: Date.now() - 900000, // 15 mins ago
      unreadMessage: "Can we reschedule for tomorrow at 2pm?",
      statusChangeLead: 505
    },
    {
      unreadLeadFirst: "Pam",
      unreadLeadLast: "Beesly",
      unreadMessageTime: Date.now() - 3600000, // 1 hour ago
      unreadMessage: "I sent the documents over.",
      statusChangeLead: 506
    }
  ],

  // Purchase History
  leadsPurchased: [
    {
      purchaseDate: new Date().toISOString(),
      count: 25
    },
    {
      purchaseDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      count: 25
    }
  ]
};

export const MOCK_LEADS: Lead[] = [
    {
        id: "lead_001",
        lead_id: "L-1001",
        agent_id: "A-55",
        name: "John Smith",
        borrower_first: "John",
        borrower_last: "Smith",
        company: "Acme Corp",
        value: 5000,
        status: "New",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "john.smith@example.com",
        phone: "+15550101",
        borrower_cell: "+15550101",
        last_contacted: null, // Never contacted
        date_assigned: new Date().toISOString(),
        tags: ["High Value", "Refi"],
        state: "CO",
        amount_contacted: 0,
        lead_type: "Mortgage Protection",
        lead_level: "Gold",
        dob: new Date('1980-05-15'),
        age: 44,
        tobacco: false,
        address: "123 Maple Dr",
        city: "Denver",
        zip: 80202,
        county: "Denver",
        co_borrower_first: "Jane",
        co_borrower_last: "Smith",
        vendor: "LeadGenius",
        mortgage: 350000,
        lender: "Wells Fargo",
        home_value: 450000,
        household_income: 120000,
        ai_text_enabled: true
    },
    {
        id: "lead_002",
        lead_id: "L-1002",
        agent_id: "A-55",
        name: "Sarah Connor",
        borrower_first: "Sarah",
        borrower_last: "Connor",
        company: "Cyberdyne",
        value: 12000,
        status: "In Progress",
        avatarUrl: "",
        email: "sarah@example.com",
        phone: "+15550202",
        borrower_cell: "+15550202",
        last_contacted: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        date_assigned: new Date(Date.now() - 86400000 * 5).toISOString(),
        tags: ["Urgent"],
        state: "CA",
        amount_contacted: 3,
        lead_type: "Final Expense",
        lead_level: "Platinum",
        dob: new Date('1975-08-20'),
        age: 49,
        tobacco: true,
        address: "456 Skyline Blvd",
        city: "Los Angeles",
        zip: 90001,
        county: "Los Angeles",
        co_borrower_first: "",
        co_borrower_last: "",
        vendor: "Internal",
        mortgage: 600000,
        lender: "Chase",
        home_value: 750000,
        household_income: 95000,
        ai_text_enabled: false
    },
    {
        id: "lead_003",
        lead_id: "L-1003",
        agent_id: "A-55",
        name: "Bruce Wayne",
        borrower_first: "Bruce",
        borrower_last: "Wayne",
        company: "Wayne Ent",
        value: 150000,
        status: "Bad Lead",
        avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "bruce@example.com",
        phone: "+15550303",
        borrower_cell: "+15550303",
        last_contacted: new Date(Date.now() - 86400000 * 10).toISOString(),
        date_assigned: new Date(Date.now() - 86400000 * 20).toISOString(),
        tags: [],
        state: "NY",
        amount_contacted: 1,
        lead_type: "IUL",
        lead_level: "Silver",
        dob: new Date('1985-02-19'),
        age: 39,
        tobacco: false,
        address: "1007 Mountain Dr",
        city: "Gotham",
        zip: 10001,
        county: "New York",
        co_borrower_first: "",
        co_borrower_last: "",
        vendor: "Facebook",
        mortgage: 0,
        lender: "N/A",
        home_value: 15000000,
        household_income: 5000000,
        ai_text_enabled: true
    }
];