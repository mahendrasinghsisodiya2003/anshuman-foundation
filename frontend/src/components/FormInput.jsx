import React from 'react';

export default function FormInput({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          className="input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="input"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
