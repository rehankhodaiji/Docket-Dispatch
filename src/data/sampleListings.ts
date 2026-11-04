import { FundingListing } from '../types';

// Real listings, each read on the funder's own page on 4 November 2026. Dates change: check the funder's page before applying.
export const SAMPLE_LISTINGS: FundingListing[] = [
  {
    id: 'dkt-vdr-01',
    funder: 'Visions du Réel',
    program: 'VdR Pitching',
    amountRange: 'Not stated (a pitching showcase, 12 to 14 April 2027)',
    status: 'Open',
    deadlineDate: 'DEC 15, 2026',
    deadlineRelative: 'Final deadline',
    stage: 'Development',
    eligibility: 'Feature-length projects over 60 minutes, in late development and not yet in production. Directors need at least one completed short film. Projects from all over the world can apply.',
    description: 'A pitching showcase and curated meetings in Switzerland for feature-length projects in late development. Selection runs on a rolling basis from October 2026.',
    decisionTimeline: 'Final selection end of February 2027',
    fiscalSponsor: 'Not stated',
    applicationFee: 'CHF 40 (CHF 30 until 2 November)',
    notes: 'Projects from all over the world can apply.'
  },
  {
    id: 'dkt-sund-01',
    funder: 'Sundance Institute',
    program: 'Documentary Film Producers Track (2027)',
    amountRange: 'Not stated',
    status: 'Open',
    deadlineDate: 'FEB 10, 2027',
    deadlineRelative: 'Opens Nov 17, 2026, 9am PT',
    stage: 'Production',
    eligibility: 'Lead producers who are not the director, have produced at least one documentary short and no more than two features as lead producer, and are in active production or post-production. US-based producers are eligible; non-US candidates must work and reside in Europe or Latin America.',
    description: 'A producers lab and fellowship. The application opens 9am PT on 17 November 2026 and closes 9am PT on 10 February 2027. The Producers Lab is 19 to 24 July 2027 in Ucross, Wyoming.',
    decisionTimeline: 'Notification by late June 2027',
    fiscalSponsor: 'Not stated',
    applicationFee: 'Not stated',
    notes: 'All applicants are considered by invitation only.'
  }
];
