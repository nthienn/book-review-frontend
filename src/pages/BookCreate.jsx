import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BookCreate = () => {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/authors/all`,
        );
        setAuthors(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!title.trim()) newErrors.title = "Please enter book title";
    if (!authorId) newErrors.authorId = "Please select an author";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/books`, {
        title,
        author: { id: authorId },
      });
      toast.success("Book created successfully!");
      navigate("/books/list");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Book</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className={`w-full p-2 border rounded-md outline-none transition-all ${
                errors.title
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className={`w-full p-2 border rounded-md outline-none transition-all ${
                errors.authorId
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <option value="">Select Author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            {errors.authorId && (
              <p className="text-red-500 text-xs mt-1">{errors.authorId}</p>
            )}
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
              onClick={() => navigate("/books/list")}
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

export default BookCreate;
