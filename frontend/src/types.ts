
import { StringList } from "@google/genai";

export type ChallengeMetric = 'dials' | 'contacts' | 'appointments' | 'apv';
export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'declined';

export interface ChallengeParticipant {
    teamId: string;
    teamName: string;
    score: number;
    // FIX: Added owner ID for permission checks
    ownerId?: number;
}

export interface TeamChallenge {
    id: string;
    challenger: ChallengeParticipant;
    opponent: ChallengeParticipant;
    metric: ChallengeMetric;
    startDate: string; // ISO string
    endDate: string; // ISO string
    status: ChallengeStatus;
    winnerTeamId?: string | null;
    description?: string; // New: Optional description
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
}

export type TournamentType = 'single-elimination' | 'round-robin';

export interface TournamentParticipant {
    teamId: string;
    teamName: string;
    seed: number;
}

export interface BracketMatch {
    matchId: string;
    round: number;
    participants: (string | null)[]; // Team IDs, null for bye
    winnerTeamId?: string | null;
    nextMatchId?: string | null;
}

export interface Tournament {
    id: string;
    name: string;
    description?: string; // New: Optional description
    type: TournamentType;
    metric: ChallengeMetric;
    participants: TournamentParticipant[];
    bracket?: BracketMatch[]; // Only for single-elimination
    status: 'pending' | 'active' | 'completed';
    organizerTeamId: string;
}

export interface App {
  id: string;
  title: string;
  description: string;
  icon: string;
  page: string;
}

export interface Lead {
  id:string;
  lead_id: string;
  agent_id: string;
  name: string;
  borrower_last:String;
  borrower_first:String;
  company: string;
  value: number;
  status: string;
  avatarUrl: string;
  email?: string;
  phone?: string;
  borrower_cell?:string;
  borrower_home?:String;
  borrower_work?:String;
  last_contacted: string | null;
  date_assigned: string;
  tags: Tag[]; // Changed from string[] to Tag[]
  state: string;
  amount_contacted: number;
  lead_type: string;
  lead_level: string;
  notes?: LeadNote[];
  files?: LeadFile[];
  qualifierData?: LeadQualifierData;
  dob:Date;
  age:number;
  tobacco:Boolean;
  address:string;
  city:string;
  zip:number;
  county:string;
  co_borrower_first:string
  co_borrower_last:string;
  vendor:string;
  mortgage:number;
  lender:string;
  home_value:number;
  household_income:number;
  ai_text_enabled:boolean;
}

export interface SalesData {
  month: string;
  revenue: number;
}

export interface AgentPermissions {
  text: number;
  email: number;
  script: number;
  objection: number;
}

export interface AgentInfo {
  agentId: number;
  organizationId: string; // Changed from 'organization' to 'organizationId' to match schema
  admin: boolean;
  organizationName: string;
  permissions: AgentPermissions | 'admin';
  agentCode: string;
  beta: boolean;
  a2pOnly: boolean;
  status: 'active' | 'inactive';
  userName: string; // This will likely be the email
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  timezone: string;
  tutorial: number; // 0 or 1, representing boolean
  statsVisible?: boolean;
  liveTransferOptIn?: boolean;
  recruitingModuleActive?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  lead_count: number;
  created: number; // unix timestamp
}

export interface GoalSetting {
  metric: 'dials' | 'contacts' | 'appointments' | 'leadsPurchased' | 'apv';
  period: 'daily' | 'weekly' | 'monthly';
}

export interface MemberGoal extends GoalSetting {
    target: number;
}

export interface TeamMember {
  id: number;
  agent_id: number | 'unknown'; // This refers to agent.id from the agents table
  first_name: string;
  last_name: string;
  agent_email?: string;
  goals?: MemberGoal[];
  statsVisible?: boolean;
}

export interface Team {
  id: string;
  name: string;
  owner: number;
  members: TeamMember[];
  goalsEnabled?: boolean;
  goalSettings?: GoalSetting[];
}

export interface TeamInvite {
  inviteId: string;
  teamId: string;
  name: string;
  team: Team; // Add the full team object to the invite
}

export interface AgentActivity {
  dials: { dialDate: string; callsMade: string; contacts: number; apv: number }[];
  // Aggregated fields for convenience/dashboard display
  totalDials: number;
  totalContacts: number;
  totalApv: number;
  totalLeadsPurchased: number;
  contactRate: number;
  appointmentRate: number;

  scheduled: { apptTitle: string; apptDate: number; apptTimezone: string; apptLead: number }[];
  appointments: number; // This is a total count, not a list of scheduled items
  scheduledCalls: { schedLeadFirst: string; schedLeadLast: string; schedTime: number; schedLead: number }[];
  statusChange: { statusChangeFirst: string; statusChangeLast: string; statusDate: number; statusName: string; statusChangeLead: number }[];
  applications: { statusChangeFirst: string; statusChangeLast: string; statusDate: number; statusName: string; statusChangeLead: number }[];
  unreadMessages: { unreadLeadFirst: string; unreadLeadLast: string; unreadMessageTime: number; unreadMessage: string; statusChangeLead: number }[];
  leadsPurchased: { purchaseDate: string; count: number }[];
}

export interface ActivityFeedItem {
  id: string;
  type: 'DIAL' | 'STATUS_CHANGE' | 'LEAD_PURCHASE' | 'APPOINTMENT' | 'VOICEMAIL' | 'NOTE';
  timestamp: string; // ISO string
  leadId?: number | null;
  leadName?: string;
  details: {
    [key: string]: any;
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface FullAgentInfo {
    id: number;
    agent_id: number; // This is redundant if 'id' is the agent ID but kept for consistency with mock
    first_name: string;
    last_name: string;
    email?: string;
}

// Marketplace Types
export interface PurchasePayload {
    items: {
        productId: string;
        productName: string;
        quantity: number;
        pricePerItem: number;
        fulfilledQuantity?: number;
        type:string;
    }[];
    total: number;
    paymentMethodId: string;
    paymentMethodCardType: 'Visa' | 'Mastercard';
    paymentMethodLast4: string;
}

export interface PaymentMethod {
  id: string;
  cardType: 'Unknown' | 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  last4: string;
  is_default:boolean;
}

export interface MarketplaceItem {
  id: string;
  type: 'script' | 'workflow' | 'service';
  name: string;
  author: string;
  rating: number;
  price: number | 'free';
  description: string;
  purchaseCount?: number;
  messageCount?: number;
  durationDays?: number;
}

export interface LeadProduct {
  id: string;
  name: string;
  type: 'Final Expense' | 'Mortgage Protection' | 'Advanced Market';
  description: string;
  pricePerLead: number;
  minQuantity: number;
  minStates: number;
  platformCloseRate: number;
}

export interface LeadVendor {
  id: string;
  name: string;
  logoUrl: string;
  userRating: number;
  description: string;
  products: LeadProduct[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerItem: number;
  fulfilledQuantity?: number; // For leads
}

export interface Order {
  id: string;
  date: string; // ISO string
  items: OrderItem[];
  total: number;
  paymentMethodId?: string;
  paymentMethodLast4?: string;
  paymentMethodCardType?: 'Visa' | 'Mastercard';
}

// Template Types
export interface TextTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  created: number; // unix timestamp
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string; // Can be HTML
  category: string;
  attachments?: { url: string; filename: string; mimeType: string; }[]; // New: Array of attachments
  created: number; // unix timestamp
}

// Script Types
export interface Script {
    id: string;
    name: string;
    category: string;
    content: string;
    lastUpdated: string;
}
export type ScriptData = Record<string, string | boolean>;
// Objection Type (New)
export interface Objection {
    id: string;
    title: string;
    solution: string;
    lastUpdated: string; // ISO String
}

// Appointment Type (New)
export interface Appointment {
    id: string;
    lead_id: string | null;
    leadFirstName?: string; // Derived from lead_id
    leadLastName?: string; // Derived from lead_id
    title: string;
    description?: string;
    appointmentTime: string; // ISO string (e.g., "2024-07-20T14:30:00Z")
    timezone: string; // e.g., "America/New_York"
    type: 'meet' | 'zoom' | 'phone' | 'home' | 'other';
    link?: string; // URL for meet/zoom
    status: 'scheduled' | 'completed' | 'canceled';
    createdAt: string; // ISO string
    lastUpdated: string; // ISO string
}


export type WorkflowStepActionType = 'send-text' | 'wait' | 'add-tag' | 'wait-until' | 'conditional';

export interface WaitStepConfig {
    duration: number;
    unit: 'minutes' | 'hours' | 'days';
}

export interface WaitUntilStepConfig {
    time: string; // "HH:MM" format
    dayOption: 'next-day' | 'next-weekday';
}

export interface TextStepConfig {
    templateId: string;
}

export interface TagStepConfig {
    tagId: string;
}

export interface ConditionalStepConfig {
    conditionType: 'has-tag' | 'status-is';
    conditionIds: (string | number)[];
    yesPath: WorkflowStep[];
    noPath: WorkflowStep[];
}

export interface WorkflowStep {
    id: string;
    type: WorkflowStepActionType;
    config: WaitStepConfig | TextStepConfig | TagStepConfig | WaitUntilStepConfig | ConditionalStepConfig;
    name: string;
}


// --- Trigger & Exit Condition Discriminated Unions ---

interface StatusChangeTrigger {
    type: 'status-change';
    ids: (string | number)[];
}

interface TagAddedTrigger {
    type: 'tag-added';
    ids: (string | number)[];
}

interface LeadTypeAndLevelTrigger {
    type: 'lead-type-and-level';
    combinations: { leadTypeId: string; leadLevelId: string; }[];
}

export type WorkflowTrigger = StatusChangeTrigger | TagAddedTrigger | LeadTypeAndLevelTrigger;

interface StatusChangeExit {
    type: 'status-change';
    ids: (string | number)[];
}

interface OnResponseExit {
    type: 'on-response';
}

export type WorkflowExitCondition = StatusChangeExit | OnResponseExit;


export interface Workflow {
    id: string;
    name: string;
    steps: WorkflowStep[];
    triggers: WorkflowTrigger[];
    exitConditions: WorkflowExitCondition[];
    stats: {
        active: number;
        completed: number;
    };
    enabled: boolean;
}

export interface WorkflowEnrollment {
    enrollmentId: string;
    leadId: string; // Changed to string to match Lead.id
    workflowId: string;
    currentStepId: string;
    enrolledDate: string; // ISO string
}


// CSV Import Types
export type Mapping = {
  [csvHeader: string]: string; // csvHeader -> dbField
};

export interface MappingProfile {
  id: string;
  name: string;
  mapping: Mapping;
}

// Training Types
export interface TrainingResource {
  id: string;
  type: 'video' | 'article' | 'pdf';
  title: string;
  description: string;
  category: string;
  contentUrl: string; // URL for video/pdf, or content for article
  thumbnailUrl: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface SimulationMessage {
    speaker: 'user' | 'bot' | 'agent' | 'client';
    text: string;
}

export interface SimulationHistory {
    id: string;
    type: 'Text' | 'Call';
    date: string; // ISO string
    scenario: {
        leadType: string;
        persona: string;
    };
    rating: 'Needs Improvement' | 'Good' | 'Excellent' | 'N/A';
    transcript: SimulationMessage[];
    feedback: string;
}

// Recruiting Types
export interface Recruit {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: string;
  applyDate: string; // ISO string
  source: string;
  state: string;
  hasLicense: boolean;
  licensedStates: string;
  notes: string;
}
export interface CityNode {
    city: string;
    state: string;
    population: number;
    zip?: string;
}

export interface JobFeed {
    id: string;
    title: string;
    description: string;
    salaryRange?: string;
    jobType: 'Full-time' | 'Part-time' | 'Contract';
    targets: CityNode[];
    xmlUrl?: string;
    createdAt: string;
}
export interface RecruitingResource {
  id: string;
  type: 'video' | 'document' | 'script';
  title: string;
  description: string;
  category: string;
  contentUrl: string;
  thumbnailUrl: string;
}

export interface SendPacketAutomation {
    id: string;
    action: 'send-packet';
    targetId: string; // Packet ID
}

export interface SendTextAutomation {
    id: string;
    action: 'send-text';
    targetId: string; // Text Template ID
}

export interface MovePipelineAutomation {
    id: string;
    action: 'move-pipeline';
    targetPipelineId: string;
    targetStageId: string;
}

export type PipelineAutomation = SendPacketAutomation | SendTextAutomation | MovePipelineAutomation;

export interface PipelineStage {
    id: string;
    title: string;
    automations: PipelineAutomation[];

}

export interface RecruitingPipeline {
    id: string;
    name: string;
    stages: PipelineStage[];
}

export interface ResourcePacket {
    id: string;
    name: string;
    resourceIds: string[];
}

export interface JobPostTemplate {
    id: string;
    title: string;
    content: string;
    lastUpdated: string; // ISO String
}

export interface RecruitingBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  viewed: boolean;
}

export interface RecruitingData {
    recruits: Recruit[];
    pipelines: RecruitingPipeline[];
    recruitingResources: RecruitingResource[];
    resourcePackets: ResourcePacket[];
    jobPostTemplates: JobPostTemplate[];
    defaultRecruitStageId: string | null; // New: ID of the globally default stage
    stats?: { // Added stats property
        totalCandidates: number;
        activePipelines: number;
        conversionRate: number;
    };
}

// New: Payloads for Scheduled Calls API
export interface ScheduledCallCreatePayload {
    lead_id: string | null;
    title: string;
    notes?: string;
    scheduled_time: string;
    status?: 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
}

export interface ScheduledCallUpdatePayload {
    title?: string;
    notes?: string;
    scheduled_time?: string;
    status?: 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
    lead_id?: string | null;
}
export interface ScheduledCall {
    id: string;
    lead_id: string | null;
    leadName?: string; // Derived from lead_id
    leadPhone?: string; // Derived from lead_id
    title: string;
    notes?: string;
    scheduled_time: string; // ISO string
    status: 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
    created_at: string; // ISO string
}

// New: Dialer Types
export type DialingMode = 'power_dial' | 'down_the_list';

export type CallOutcome = 'appointment' | 'dnc' | 'answered' | 'voicemail' | 'no_answer' | 'busy' | 'disconnected' | 'other';

export type CallOutcomeCategory = 'talked' | 'no_contact' | 'invalid';

export interface DialSessionConfig {
    dialsPerLead: number; // Max 3
    mode: DialingMode;
    rotateNumbers: boolean;
    availableNumbers: ProvisionedNumber[];
    amdEnabled:string; // Numbers agent can dial from
}

export interface DialSessionLead {
  leadId: string;
  name: string;
  agent_id:string;
  phone: string; // Main phone to call
  dialAttempts: number; // How many times this lead has been called in current session
  status: string; // Current lead status
  // Add more lead info needed for UI/AI suggestions during a call
  firstName: String;
  lastName: String;
  email?: string;
  leadType?: string;
  leadLevel?: string;
}

export interface DialSession {
    id: string;
    agentId: number;
    config: DialSessionConfig;
    leadsQueue: DialSessionLead[]; // Remaining leads to call
    currentLead: DialSessionLead | null;
    currentCallState: 'idle' | 'ringing' | 'connected' | 'voicemail' | 'ended_by_agent' | 'waiting_for_next';
    currentCallOutcome: CallOutcome | null;
    currentCallStartTime: string | null; // ISO string
    activeTwilioCallSid: string | null;
    currentOutgoingNumber: string | null; // The number used for the current call
    nextNumberIndex: number; // For rotating numbers
}

export interface DialSessionState {
    activeSession: boolean;
    sessionLeads: DialSessionLead[]; // All leads participating in the session
    currentLead: DialSessionLead | null;
    currentDialAttempt: number; // Current attempt for the current lead
    sessionConfig: DialSessionConfig | null;
    callStatus: 'wrap_up' | 'idle' | 'dialing' | 'ringing' | 'connected' | 'voicemail_detected' | 'call_ended';
    // For "Down the list" mode
    queueDisplay: DialSessionLead[];
}
export type PostCategory = 'Win' | 'Question' | 'Announcement' | 'General';

export interface SocialPost {
    id: string;
    authorId: number;
    authorName: string;
    authorAvatar?: string;
    title: string;
    content: string;
    category: PostCategory;
    likesCount: number;
    commentsCount: number;
    timestamp: string; // ISO string
    isLikedByCurrentUser?: boolean; // New: Tracks if the current user liked this post
}

export interface SocialComment {
    id: string;
    postId: string;
    authorId: number;
    authorName: string;
    authorAvatar?: string;
    content: string;
    timestamp: string; // ISO string
}
export interface SocialChannel {
    id: string;
    name: string;
    description: string;
    type: 'public' | 'private';
    kind?: 'text' | 'voice';
    lastActivity: string; // ISO string
    activeParticipants?: { id: number; name: string; avatarUrl?: string }[];
    allowedUserIds?: number[]; // New: For private channels, list of user IDs allowed to join
    createdBy?: number; // New: ID of the user who created the channel
}

export interface SocialMessage {
    id: string;
    channelId: string;
    authorId: number;
    authorName: string;
    authorAvatar?: string;
    content: string;
    timestamp: string; // ISO string
}

// --- INCOMING CALL TYPES ---
export interface IncomingCall {
  id: string; // Call SID
  callerName: string;
  callerNumber: string;
  leadId?: string; // If identified
  leadContext?: {
    lastContacted: string | null;
    status: string;
    leadType: string;
  };
  startTime: string;
  callObject?: any;
}
export type AmdStatus = 'detecting' | 'human' | 'machine' | 'unknown';

export interface PhoneState {
  incomingCall: IncomingCall | null;
  activeCall: IncomingCall | null; // When answered
  callState: 'idle' | 'ringing' | 'connected' | 'ended';
  isMuted: boolean;
  callDuration: number; // New: Persistent call duration in seconds
  secondaryIncomingCall?: IncomingCall | null; // New: For call waiting support
  heldCall?: IncomingCall | null; // New: For call swapping support
  amdStatus?: AmdStatus;
}
export type GoalMetric = 'dials' | 'contacts' | 'leadsReceived' | 'appointments' | 'applications' | 'apv';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PersonalGoal {
  id: string;
  metric: GoalMetric;
  period: GoalPeriod;
  target: number;
  progress: number;
  showInDialer?: boolean;
}
export interface StatusCategory {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

export type UnderlyingStatus = 'ni' | 'taken' | 'contact' | 'no_contact' | 'appointment' | 'application' | 'dnc';

export interface LeadStatus {
  id: string;
  name: string;
  categoryId: string; // Link to StatusCategory
  underlyingStatus: UnderlyingStatus;
  appointment:boolean;
  contact: boolean;
  application: boolean;
}

export type SmartListRuleAttribute = 'NEVER_CONTACTED' | 'LAST_CONTACTED_DAYS' | 'CONTACT_ATTEMPTS' | 'LEAD_LEVEL' | 'STATUS' | 'LEAD_AGE';

export interface SmartListRule {
    id: SmartListRuleAttribute;
    label: string;
    description: string;
    enabled: boolean;
    config: {
        operator?: 'gt' | 'lt' | 'eq'; // For >, <, =
        value?: number; // For single number values (days, attempts, age)
        values?: (string | number)[]; // For multi-select values (statuses, lead levels)
    };
}

// Missing Filter types
export interface FilterValue<T> {
    include: T[];
    exclude: T[];
}

export interface RangeFilterValue {
    min: number | null;
    max: number | null;
}

export interface DateRangeFilterValue {
    start: string | null; // ISO Date string or null
    end: string | null;
}

export interface FilterState {
    searchTerm: string;
    statuses: FilterValue<number>;
    tags: FilterValue<string>;
    dateAssigned: DateRangeFilterValue;
    dateAssignedDaysAgo: RangeFilterValue;
    lastContacted: DateRangeFilterValue;
    lastContactedDaysAgo: RangeFilterValue;
    amountContacted: RangeFilterValue;
    leadTypes: FilterValue<string>;
    leadLevels: FilterValue<string>;
    states: FilterValue<string>;
}

export interface FilterOptions {
    statuses: { id: number; name: string }[];
    tags: { id: string; name: string }[];
    leadTypes: { id: string; name: string }[];
    leadLevels: { id: string; name: string }[];
    states: { id: string; name: string }[];
}

export interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
}

export interface LeadNote {
    id: string;
    lead_id: string;
    content: string;
    created_at: string;
    agent_name: string;
}

export interface LeadFile {
    id: string;
    lead_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
    agent_name: string;
}

export interface LeadQualifierData {
    smoker: 'yes' | 'no';
    annualIncome: number;
    healthConditions: string;
    desiredCoverage: number;
    age?: number;
}

export interface Quote {
    id: string;
    company: string;
    coverage: string;
    monthly_premium: string;
    notes: string;
}

export interface ProvisionedNumber {
    sid: string;
    phoneNumber: string;
    friendlyName: string;
    capabilities: any;
}

export interface CallRecordingSettings {
    agent_id: number;
    recording_consent: number;
    record_side: number;
    record_calls: number;
}

export interface AgentCallRecording {
    id: string;
    lead_id: string;
    leadName: string;
    caller_number: string;
    call_type: 'incoming' | 'outgoing';
    recording_url: string;
    duration: number;
    call_date: string;
    is_saved: boolean;
    shared_with: { method: string; recipient: string; shared_at: string }[];
}

export type LeadFieldType = 'text' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'boolean';

export interface LeadFieldOption {
    value: string | number;
    label: string;
}

export interface LeadFieldConfig {
    id: keyof Lead;
    label: string;
    type: LeadFieldType;
    group: string;
    editable: boolean;
    required?: boolean;
    options?: LeadFieldOption[];
}

export type LeadLayoutBlockType = 'lead_details' | 'tags' | 'activity_log' | 'notes_overview' | 'files_overview';

export interface LeadLayoutType {
    default: LeadLayoutBlockType[];
    [key: string]: LeadLayoutBlockType[];
}

export interface LeadFieldLayout {
    default: (keyof Lead)[];
    [key: string]: (keyof Lead)[];
}

export interface UsageRecord {
    id: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    textMessagesSent: number;
    callsMade: number;
    leadsPurchased: number;
}

export interface StripeSubscription {
    id: string;
    customer_id: string;
    description: string;
    status: string;
    quantity: number;
    start_date: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    cancel_at: string | null;
    paused_at?: string;
    plan: {
        id: string;
        name: string;
        amount: number;
        currency: string;
        interval: string;
        interval_count: number;
        description?: string;
    };
    balance_due: number;
}

export interface Conversation {
    id: string;
    type: 'Sales' | 'Recruiting';
    contactId: string;
    contactName: string;
    contactAvatarUrl?: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    contactStatus?: string;
    contactStage?: string;
    messages: Message[];
    correspondentNumber?: string;
    agentNumber?: string;
    localNumber?: string;
    scheduledMessage?: {
        id: string;
        text: string;
        scheduledAt: string;
        imageUrl?: string;
    }
}

export interface Message {
    id: string;
    text: string;
    sender: 'agent' | 'contact';
    timestamp: string;
    imageUrl?: string;
    status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface WarmMarketContact {
    id: number;
    fullName: string;
    phone: string;
    email?: string;
    company: string;
    location: string;
    importDate: string;
    suggestion?: string;
    status: 'pending' | 'categorized' | 'ignored';
    category?: string;
}

export interface AgentConversation {
    id: string;
    participantIds: number[];
    messages: {
        id: string;
        senderId: number;
        text: string;
        timestamp: string;
    }[];
}

export interface Voicemail {
    id: string;
    lead_id: string | null;
    name: string;
    number: string;
    duration: number;
    timestamp: number;
    url: string;
    message_heard: 'yes' | 'no';
    borrower_first?: string;
    borrower_last?: string;
    message_from: string;
    formatted_timestamp: number;
}

export interface VoiceRecording {
    id: string;
    name: string;
    file_url: string;
    duration: number;
    type: 'voicemail_box' | 'voicemail_drop';
    is_default?: boolean;
    created_at: string;
}
