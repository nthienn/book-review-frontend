import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Pagination from "../components/Paginaion";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const pageSize = 5;

  const fetchAuthors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/authors?page=${page}&size=${pageSize}`,
      );
      setAuthors(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page]);

  const handleOpenEdit = (author) => {
    setError("");
    setSelectedAuthor(author);
    setEditName(author.name);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      setError("Please enter name");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/authors/${selectedAuthor.id}`,
        { name: editName },
      );
      toast.success("Updated successfully!");
      setIsEditOpen(false);
      setError("");
      fetchAuthors();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/authors/${selectedAuthor.id}`,
      );
      toast.success("Deleted successfully!");
      setIsDeleteOpen(false);
      if (authors.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchAuthors();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Authors</h1>
        <button
          onClick={() => navigate("/authors/create")}
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
                Name
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Books
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, index) => (
              <tr
                key={author.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-center">
                  {page * pageSize + index + 1}
                </td>
                <td className="p-4 font-medium">{author.name}</td>
                <td className="p-4 text-center">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {author.booksCount}
                  </span>
                </td>
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(author)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAuthor(author);
                      setIsDeleteOpen(true);
                    }}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {authors.length === 0 && (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-500">
                  No authors found. Try creating one!
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
          setError("");
        }}
        title="Edit Author"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => {
            setEditName(e.target.value);
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
          Are you sure you want to delete <b>{selectedAuthor?.name}</b>? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
export default AuthorList;
