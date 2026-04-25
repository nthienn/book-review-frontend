import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AuthorList from "./pages/AuthorList";
import AuthorCreate from "./pages/AuthorCreate";
import BookList from "./pages/BookList";
import BookCreate from "./pages/BookCreate";
import ReviewList from "./pages/ReviewList";
import ReviewCreate from "./pages/ReviewCreate";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/authors/list" />} />

            <Route path="/authors/list" element={<AuthorList />} />
            <Route path="/authors/create" element={<AuthorCreate />} />

            <Route path="/books/list" element={<BookList />} />
            <Route path="/books/create" element={<BookCreate />} />

            <Route path="/reviews/list" element={<ReviewList />} />
            <Route path="/reviews/create" element={<ReviewCreate />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
