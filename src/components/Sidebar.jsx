import { BookOpen, ChevronDown, ChevronRight, Star, Users } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState("authors");

  const menus = [
    {
      id: "authors",
      name: "Authors",
      icon: <Users size={20} />,
      sub: ["List", "Create"],
    },
    {
      id: "books",
      name: "Books",
      icon: <BookOpen size={20} />,
      sub: ["List", "Create"],
    },
    {
      id: "reviews",
      name: "Reviews",
      icon: <Star size={20} />,
      sub: ["List", "Create"],
    },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <div className="text-xl font-bold mb-8 flex items-center gap-2">
        <img src="/favicon.svg" alt="Logo" className="w-8 h-8 object-contain" />
        Book Review
      </div>

      <nav>
        {menus.map((menu) => (
          <div key={menu.id} className="mb-4">
            <button
              onClick={() => setOpenMenu(openMenu === menu.id ? "" : menu.id)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                {menu.icon}
                <span>{menu.name}</span>
              </div>
              {openMenu === menu.id ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenu === menu.id && (
              <div className="ml-9 mt-2 flex flex-col gap-2 border-l border-gray-700 pl-4">
                {menu.sub.map((sub) => (
                  <NavLink
                    key={sub}
                    to={`/${menu.id}/${sub.toLowerCase()}`}
                    className={({ isActive }) =>
                      `text-gray-400 hover:text-yellow-500 text-sm transition-all ${isActive ? "text-yellow-500 font-medium" : ""}`
                    }
                  >
                    {sub}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
