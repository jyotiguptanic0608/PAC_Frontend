import { useNavigate } from "react-router-dom";
function Navbar() {
   const navigate = useNavigate();
  return (
    <div className="flex justify-center mt-8">

     <div
className="
bg-[#072A80]
rounded-full
shadow-2xl
border-4 border-amber-500
w-[80%]
py-4
flex
justify-center
gap-30
"
>

        <button
          className="text-white text-2xl font-semibold hover:text-orange-300 duration-300"
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          className="text-white text-2xl font-semibold hover:text-orange-300 duration-300"
          onClick={() => navigate("/about")}
        >
          About Us
        </button>

      <button
    className="text-white text-2xl font-semibold hover:text-orange-300"
    onClick={() => navigate("/register")}
>
    Register
</button>

<button
    className="text-white text-2xl font-semibold hover:text-orange-300"
    onClick={() => navigate("/login")}
>
    Sign In
</button>
      </div>

    </div>
  );
}

export default Navbar;