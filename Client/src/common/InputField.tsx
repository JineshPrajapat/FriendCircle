import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string | number;  
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange }) => {
  return (
    <div className="space-y-2 mb-4">
      <label className="block text-gray-700 text-left">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 mt-1 border rounded-md focus:outline-none text-black focus:border-blue-500"
      />
    </div>
  );
};

export default InputField;
