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

export interface WaitlistSubmission {
  email: string;
  filmmakerRole?: string;
  projectStage?: string;
  submittedAt: string;
  confirmationCode: string;
  queuePosition: number;
}
