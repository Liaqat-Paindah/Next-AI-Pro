import { FileText } from "lucide-react";

interface DocumentLinkProps {
  href?: string;
  label: string;
}

const DocumentLink = ({ href, label }: DocumentLinkProps) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      <span className="text-gray-900 dark:text-white">{label}</span>
    </a>
  );
};

export default DocumentLink;