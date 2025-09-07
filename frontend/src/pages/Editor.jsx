import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";

export default function Editor() {
  const [form, setForm] = useState({
    title: "",
    fullName: "",
    email: "",
    phone: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const abortRef = useRef(null);

  const fetchResume = useCallback(async () => {
    if (!id) return;
    setError(null);
    setFetching(true);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await api.get(`/resumes/${id}`, { signal: controller.signal });
      const r = res.data;
      setForm({
        title: r.title || "",
        fullName: r.personal?.fullName || "",
        email: r.personal?.email || "",
        phone: r.personal?.phone || "",
        skills: Array.isArray(r.skills) ? r.skills.join(", ") : r.skills || "",
      });
    } catch (err) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") return;
      console.error("Failed to fetch resume:", err);
      setError(err.response?.data?.error || err.message || "Failed to load resume");
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResume();
    return () => abortRef.current?.abort();
  }, [fetchResume]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        title: form.title.trim() || "Untitled Resume",
        personal: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (id) {
        await api.put(`/resumes/${id}`, payload);
        alert("✅ Resume updated");
      } else {
        await api.post("/resumes", payload);
        alert("✅ Resume created");
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("API Error:", err);
      alert("❌ " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {id ? "✏️ Edit Resume" : "📝 Create Resume"}
        </h1>

        {fetching && <p className="text-gray-600">Loading resume…</p>}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Resume title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || fetching}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
            >
              {id
                ? loading
                  ? "Updating…"
                  : "Update Resume"
                : loading
                ? "Saving…"
                : "Save Resume"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
