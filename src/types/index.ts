export interface FundingListing {
  id: string;
  funder: string;
  program: string;
  amountRange: string;
  status: 'Open' | 'Closes Soon';
  deadlineDate: string;
  deadlineRelative: string;
  stage: 'Production' | 'Development' | 'Post-Production' | 'Commissioning';
  eligibility: string;
  description: string;
  decisionTimeline: string;
  fiscalSponsorRequired: boolean;
  notes: string;
}

export type PlanId = 'annual' | 'monthly';

export interface SignupSubmission {
  email: string;
  filmmakerRole?: string;
  projectStage?: string;
  plan: PlanId;
  submittedAt: string;
}
