import { FundingListing } from '../types';

export const SAMPLE_LISTINGS: FundingListing[] = [
  {
    id: 'dkt-sund-01',
    funder: 'Sundance Institute',
    program: 'Documentary Film Program (DFP) Production Grant',
    amountRange: '$25,000 – $40,000',
    status: 'Open',
    deadlineDate: 'OCT 24, 2026',
    deadlineRelative: 'Closes in 26 days',
    stage: 'Production',
    eligibility: 'US-based directors or producers with creative control; feature-length (70m+) non-fiction',
    description: 'Direct grant support for independent non-fiction films with cinematic ambition, distinctive creative voice, and cultural resonance. Grantees retain full creative and editorial control.',
    decisionTimeline: '12–14 weeks from submission close',
    fiscalSponsorRequired: true,
    notes: 'Prior rough cut or 10-minute work sample required. Non-US co-productions permitted if lead director is US resident.'
  },
  {
    id: 'dkt-itvs-02',
    funder: 'ITVS (Independent Television Service)',
    program: 'Open Call Co-Production Agreement',
    amountRange: 'Up to $350,000',
    status: 'Closes Soon',
    deadlineDate: 'OCT 09, 2026',
    deadlineRelative: 'Closes in 11 days (5:00 PM PT)',
    stage: 'Production',
    eligibility: 'US citizens or legal permanent residents with previous broadcast or festival credit as lead director/producer',
    description: 'Major non-reciprocal co-production financing for standalone non-fiction projects destined for national public television broadcast on PBS (Independent Lens or POV). Includes packaging, legal review, and clearance mentorship.',
    decisionTimeline: 'Round 1 notifications within 8 weeks',
    fiscalSponsorRequired: false,
    notes: 'Requires detailed line-item budget in standard ITVS format and treatment with clear narrative arc.'
  },
  {
    id: 'dkt-ida-03',
    funder: 'International Documentary Association (IDA)',
    program: 'Enterprise Documentary Fund: Production Track',
    amountRange: '$25,000 – $100,000',
    status: 'Open',
    deadlineDate: 'NOV 14, 2026',
    deadlineRelative: 'Closes in 47 days',
    stage: 'Production',
    eligibility: 'US and international filmmakers covering verified public interest journalism, investigative reporting, or constitutional freedoms',
    description: 'Unrestricted funding aimed at feature-length non-fiction works addressing urgent contemporary issues through meticulous journalistic rigor. Includes access to legal consultation and security protocols.',
    decisionTimeline: '16 weeks',
    fiscalSponsorRequired: true,
    notes: 'Journalistic integrity statement required. Open to independent teams with 501(c)(3) sponsor.'
  },
  {
    id: 'dkt-bbc-04',
    funder: 'BBC Storyville & Channel 4',
    program: 'International Feature Documentary Co-Commissioning Call',
    amountRange: '£40,000 – £120,000 ($52,000 – $155,000)',
    status: 'Closes Soon',
    deadlineDate: 'OCT 12, 2026',
    deadlineRelative: 'Closes in 14 days (11:59 PM BST)',
    stage: 'Commissioning',
    eligibility: 'Independent production companies with US/UK co-production arrangements or international pre-sales in progress',
    description: 'Targeted broadcast commissioning window for bold, cinematic narrative documentaries with strong international storytelling and singular access. Projects must deliver for theatrical and primetime linear broadcast.',
    decisionTimeline: '4–6 weeks for shortlisted pitching',
    fiscalSponsorRequired: false,
    notes: 'Accepts 3-page pitch deck with trailer link. UK rights negotiation required upon commission award.'
  }
];
