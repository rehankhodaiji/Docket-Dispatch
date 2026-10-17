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
  }
];
