import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthorCreate = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter name");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/authors`, { name });
      toast.success("Author created successfully!");
      navigate("/authors/list");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Author</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value) setError("");
              }}
              placeholder="Enter author name"
              className={`w-full p-2 border rounded-md outline-none transition-all ${
                error
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-medium transition-all cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/authors/list")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorCreate;
