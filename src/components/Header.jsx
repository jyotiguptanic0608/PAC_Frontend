import NB from "../assets/NB.png";
import NIC from "../assets/NIC.jpg";

function Header() {
  return (
    <div className="px-16 pt-8 h-45">

      <div className="flex justify-between items-center">

        
        <div className="flex items-center">

          <img
            src={NB}
            alt="National Emblem"
            className="h-32"
          />

          <div className="ml-6">

            <h1 className="text-5xl font-bold text-[#0B2C84]">
              MeitY
            </h1>

            <p className="text-[#0B2C84] text-0.3xl">
              Ministry of Electronics and Information Technology
            </p>

            <p className="text-[#0B2C84] text-0.3xl">
              Government of India
            </p>

          </div>

        </div>

        <img
          src={NIC}
          alt="NIC Logo"
          className="h-30 object-contain rounded-full"
        />

      </div>

    </div>
  );
}

export default Header;