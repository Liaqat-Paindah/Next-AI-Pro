import { Application } from "@/types/application_details";
import DocumentLink from "../DocumentLink";

interface DocumentsTabProps {
  supportingDocuments: Application['supportingDocuments'];
  files: Application['files'];
}

const DocumentsTab = ({ supportingDocuments, files }: DocumentsTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Supporting Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportingDocuments.sop && <DocumentLink href={files.sopUrl} label="Statement of Purpose" />}
        {supportingDocuments.recommendationLetter && (
          <DocumentLink href={files.recommendationLettersUrl} label="Recommendation Letters" />
        )}
        {supportingDocuments.cv && <DocumentLink href={files.cvUrl} label="CV / Resume" />}
        {supportingDocuments.researchProposal && (
          <DocumentLink href={files.researchProposalUrl} label="Research Proposal" />
        )}
        {supportingDocuments.portfolio && <DocumentLink href={files.portfolioUrl} label="Portfolio" />}
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-3">
          Identification Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentLink href={files.nidUrl} label="National ID" />
          <DocumentLink href={files.passportUrl} label="Passport" />
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;