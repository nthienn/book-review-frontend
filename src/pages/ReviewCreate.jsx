import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReviewCreate = () => {
  const [content, setContent] = useState("");
  const [bookId, setBookId] = useState("");
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/books/all`,
        );
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!bookId) newErrors.bookId = "Please select a book";
    if (!content.trim()) newErrors.content = "Please enter review content";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        content,
        book: { id: bookId },
      });
      toast.success("Review created successfully!");
      navigate("/reviews/list");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Review</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book <span className="text-red-500">*</span>
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className={`w-full p-2 border rounded-md outline-none transition-all ${
                errors.bookId
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
              <option value="">Select a Book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} ({book.author.name})
                </option>
              ))}
            </select>
            {errors.bookId && (
              <p className="text-red-500 text-xs mt-1">{errors.bookId}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-2 border rounded-md h-32 outline-none ${errors.content ? "border-red-500" : "border-gray-300"}`}
              placeholder="What do you think about this book?"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
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
              onClick={() => navigate("/reviews/list")}
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

export default ReviewCreate;
