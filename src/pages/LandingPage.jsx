import { useNavigate } from "react-router-dom";
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-center pt-24 pb-20
      flex
      justify-center
      pt-24
      "
    >

      <div
        className="
        bg-white
        w-[1000px]
        h-fit
        rounded-[40px]
        shadow-2xl
        p-20
        border-t-[8px]
        border-orange-500
        text-center
        "
      >

        <h1 className="text-[#1D3E9C] text-7xl font-bold mb-8">
          Proposal Management System
        </h1>

        <p className="text-gray-700 text-3xl mb-12">
          Submit and manage proposals efficiently
        </p>

        <button
          className="
          bg-orange-600
          hover:bg-orange-700
          text-white
          px-14
          py-5
          rounded-3xl
          text-3xl
          font-bold
          shadow-xl
          duration-300
          "
          onClick={() => navigate("/login")}
        >
          LOGIN
        </button>

      </div>

    </div>
  );
}

export default LandingPage;