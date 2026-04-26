const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="p-4 flex justify-end items-center gap-4 bg-gray-50">
      <span className="text-sm text-gray-600 font-medium">
        Page {currentPage + 1} of {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded-md transition-all cursor-pointer ${
              page === currentPage
                ? "bg-yellow-500 text-white border-yellow-500 font-bold"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
