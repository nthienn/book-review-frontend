import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Pagination from "../components/Paginaion";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({ bookId: "", content: "" });
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const pageSize = 5;

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews?page=${page}&size=${pageSize}`,
      );
      setReviews(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleOpenEdit = async (review) => {
    setErrors({});
    setSelectedReview(review);
    setFormData({
      bookId: review.bookId,
      content: review.content,
    });

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/books/all`,
      );
      setBooks(res.data);
      setIsEditOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    let newErrors = {};
    if (!formData.bookId) newErrors.bookId = "Please select a book";
    if (!formData.content.trim())
      newErrors.content = "Please enter review content";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/reviews/${selectedReview.id}`,
        {
          book: { id: formData.bookId },
          content: formData.content,
        },
      );
      toast.success("Updated successfully!");
      setIsEditOpen(false);
      setErrors({});
      fetchReviews();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reviews/${selectedReview.id}`,
      );
      toast.success("Deleted successfully!");
      setIsDeleteOpen(false);
      if (reviews.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchReviews();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <button
          onClick={() => navigate("/reviews/create")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition-all cursor-pointer"
        >
          Create New
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-700 text-center">
                No
              </th>
              <th className="p-4 font-semibold text-gray-700 text-left">
                Book
              </th>
              <th className="p-4 font-semibold text-gray-700 text-left">
                Author
              </th>
              <th className="p-4 font-semibold text-gray-700 text-left">
                Review
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={review.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-center">
                  {page * pageSize + index + 1}
                </td>
                <td className="p-4 font-medium">{review.bookTitle}</td>
                <td className="p-4 text-blue-600">{review.authorName}</td>
                <td className="p-4 text-gray-800 max-w-xs truncate">
                  {review.content}
                </td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(review)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setIsDeleteOpen(true);
                    }}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setErrors({});
        }}
        title="Edit Review"
        footer={
          <>
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all cursor-pointer"
            >
              Update
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.bookId}
              onChange={(e) =>
                setFormData({ ...formData, bookId: e.target.value })
              }
              className={`w-full p-2 border rounded-md outline-none transition-all ${
                errors.bookId
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            {errors.bookId && (
              <p className="text-red-500 text-xs mt-1">{errors.bookId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className={`w-full p-2 border rounded-md h-32 outline-none ${errors.content ? "border-red-500" : "border-gray-300"}`}
              placeholder="What do you think about this book?"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all cursor-pointer"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete this review? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default ReviewList;
