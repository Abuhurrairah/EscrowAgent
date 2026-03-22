export type AgreementDraft = {
  title: string;
  workerRole: string;
  budgetSuggestion: string;
  deadlineSuggestion: string;
  deadlineIso?: string;
  acceptanceCriteria: string[];
  agreementSummary: string;
};

export const mockAgreementDraft = (description: string): AgreementDraft => {
  const now = new Date();
  const suggested = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    title: "Freelance Delivery Task",
    workerRole: "Freelance builder",
    budgetSuggestion: "0.5",
    deadlineSuggestion: `Within 7 days (${suggested.toLocaleDateString()})`,
    deadlineIso: suggested.toISOString(),
    acceptanceCriteria: [
      "Deliver the requested work at the agreed URL.",
      "Provide a final proof hash that matches the delivered file.",
      "Client confirms the deliverable meets the written scope."
    ],
    agreementSummary: `Scope: ${description.slice(0, 180) || "Freelance task delivery"}. Payment is released after proof review.`
  };
};
