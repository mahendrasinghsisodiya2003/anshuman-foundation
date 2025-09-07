import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Preview() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    api.get("/resumes").then((res) => {
      setResumes(res.data);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Saved Resumes</h1>
      <ul className="space-y-4">
        {resumes.map((r) => (
          <li key={r._id} className="border p-4 rounded">
            <p><strong>{r.personal?.fullName}</strong></p>
            <p>{r.personal?.email}</p>
            <p>{r.personal?.phone}</p>
            <p>Skills: {r.skills?.join(", ")}</p>
            <p className="text-sm text-gray-600">📄 PDF: {r.pdfPath}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
