interface InfoFieldProps {
  label: string;
  value?: string | number | null;
}

const InfoField = ({ label, value }: InfoFieldProps) => {
  if (!value) return null;
  
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <p className="text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

export default InfoField;