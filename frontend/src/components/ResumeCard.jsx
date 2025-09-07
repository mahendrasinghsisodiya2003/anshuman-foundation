import React from 'react';
import { Link } from 'react-router-dom';

export default function ResumeCard({ resume }) {
  return (
    <li className="border rounded-xl p-4 flex justify-between">
      <div>
        <div className="font-semibold">{resume.title}</div>
        <div className="text-sm text-gray-600">Updated {new Date(resume.updatedAt).toLocaleString()}</div>
      </div>
      <div className="flex gap-2">
        <Link className="btn" to={`/resumes/${resume._id}`}>Edit</Link>
      </div>
    </li>
  );
}
