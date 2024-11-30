"use client";

const FormField = ({ label, type, value, onChange, name, error }) => {
  return (
    <div className="relative mb-4">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 bg-gray-200 rounded-md text-gray-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-3 text-gray-800 text-lg font-semibold pointer-events-none transition-all duration-300 transform scale-100 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
      >
        {label}
      </label>
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default FormField;