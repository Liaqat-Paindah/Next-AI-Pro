interface TagListProps {
  items?: string[];
  label?: string;
}

const TagList = ({ items, label }: TagListProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 mt-1">
        {items.map((item, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagList;