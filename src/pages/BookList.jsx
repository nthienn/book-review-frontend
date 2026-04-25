import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({ title: "", authorId: "" });
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const pageSize = 5;

  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/books?page=${page}&size=${pageSize}`,
      );
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleOpenEdit = async (book) => {
    setErrors({});
    setSelectedBook(book);
    setFormData({
      title: book.title,
      authorId: book.authorId,
    });
    setIsEditOpen(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/authors/all`,
      );
      setAuthors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Please enter book title";
    if (!formData.authorId) newErrors.authorId = "Please select an author";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/books/${selectedBook.id}`,
        {
          title: formData.title,
          author: { id: formData.authorId },
        },
      );
      toast.success("Updated successfully!");
      setIsEditOpen(false);
      setErrors({});
      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/books/${selectedBook.id}`,
      );
      toast.success("Deleted successfully!");
      setIsDeleteOpen(false);
      if (books.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchBooks();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>
        <button
          onClick={() => navigate("/books/create")}
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
                Title
              </th>
              <th className="p-4 font-semibold text-gray-700 text-left">
                Author
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr
                key={book.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-center">
                  {page * pageSize + index + 1}
                </td>
                <td className="p-4 font-medium">{book.title}</td>
                <td className="p-4 text-blue-600">{book.authorName}</td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(book)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setIsDeleteOpen(true);
                    }}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {books.length === 0 && (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-500">
                  No books found. Try creating one!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="p-4 flex justify-end items-center gap-4 bg-gray-50">
          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setErrors({});
        }}
        title="Edit Book"
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
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter book title"
              className={`w-full border p-2 rounded outline-none transition-all ${
                errors.title
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.authorId}
              onChange={(e) =>
                setFormData({ ...formData, authorId: e.target.value })
              }
              className={`w-full p-2 border rounded-md outline-none transition-all ${
                errors.authorId
                  ? "border-red-500 ring-1 ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            >
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
          Are you sure you want to delete <b>{selectedBook?.title}</b>? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default BookList;
