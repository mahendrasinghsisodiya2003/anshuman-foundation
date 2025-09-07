import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resumes");
      setResumes(res.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      alert("❌ Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      alert("✅ Resume deleted");
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("❌ Failed to delete resume");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 pt-24 pb-12">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
        🎯 My Resumes
      </h1>

      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && resumes.length === 0 && (
        <p className="text-gray-600 italic">No resumes yet. Create one below!</p>
      )}

      <div className="space-y-4">
        {resumes.map((resume) => (
          <div
            key={resume._id}
            className="p-5 bg-white shadow-md rounded-xl border border-indigo-100 flex items-center justify-between hover:shadow-lg transition duration-300"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800">{resume.title}</h2>
              <p className="text-sm text-gray-500">
                {resume.personal?.fullName} | {resume.personal?.email}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(resume.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/editor?id=${resume._id}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => handleDelete(resume._id)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow transition"
              >
                🗑️ Delete
              </button>
              <a
                href={`https://anshuman-foundations.onrender.com/${resume._id}/download`}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition"
              >
                ⬇️ Download
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          to="/editor"
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-xl shadow transition"
        >
          + Create New Resume
        </Link>
      </div>
    </div>
  );
}
