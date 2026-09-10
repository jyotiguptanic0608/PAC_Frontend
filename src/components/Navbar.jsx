import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex justify-center mt-4 mb-4 px-4">
      <div
        className="
          bg-[#072A80]
          rounded-full
          shadow-xl
          border-2 border-amber-500/90
          w-full max-w-4xl
          py-2.5 px-6
          flex
          justify-around
          items-center
        "
      >
        <button
          className={`text-sm sm:text-base font-semibold transition-all cursor-pointer ${
            isActive("/") ? "text-amber-400 font-bold" : "text-white hover:text-amber-300"
          }`}
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          className={`text-sm sm:text-base font-semibold transition-all cursor-pointer ${
            isActive("/about") ? "text-amber-400 font-bold" : "text-white hover:text-amber-300"
          }`}
          onClick={() => navigate("/about")}
        >
          About Us
        </button>

        <button
          className={`text-sm sm:text-base font-semibold transition-all cursor-pointer ${
            isActive("/register") ? "text-amber-400 font-bold" : "text-white hover:text-amber-300"
          }`}
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        <button
          className={`text-sm sm:text-base font-semibold transition-all cursor-pointer ${
            isActive("/login") ? "text-amber-400 font-bold" : "text-white hover:text-amber-300"
          }`}
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Navbar;