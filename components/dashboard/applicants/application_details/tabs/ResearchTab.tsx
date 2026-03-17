import { Application } from "@/types/application_details";

interface ResearchTabProps {
  data: Application['research'];
}

const ResearchTab = ({ data }: ResearchTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Research & Publications
      </h2>

      {data.hasArticles && data.articles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white">Articles</h3>
          {data.articles.map((article, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">{article.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {article.citation}
              </p>
              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block"
                >
                  View Article
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {data.hasProjects && data.projects.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white">Projects</h3>
          {data.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
              {project.fileUrl && (
                <a
                  href={project.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block"
                >
                  View Project File
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {data.hasConferences && data.conferences.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white">Conferences</h3>
          {data.conferences.map((conference, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">{conference.title}</p>
              {conference.fileUrl && (
                <a
                  href={conference.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block"
                >
                  View Conference File
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchTab;