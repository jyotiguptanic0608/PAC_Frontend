import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LoginPage({ setIsLoggedIn }) {
    const navigate = useNavigate();
const[passw,setPassw]=useState("");
const[userId,setUserId]=useState("");
const [captcha,setCaptcha]=useState("");
const [showForceLogin, setShowForceLogin] = useState(false);
const [captchaImage, setCaptchaImage] = useState(
    "http://localhost:8080/api/captcha"
);
const [forceLogin, setForceLogin] = useState(false);

async function handleLogin() {
    if (forceLogin && captcha.trim() === "") {
    alert("Please enter the new CAPTCHA.");
    return;
}
    try {
        
  const url = forceLogin
    ? "http://localhost:8080/api/employees/force-login"
    : "http://localhost:8080/api/employees/login";

const response = await axios.post(
    url,
    null,
    {
        params: {
    username: userId,
    password: passw,
    captcha: captcha
},
 withCredentials: true
    }
);

        if (response.data) {
            setForceLogin(false);
            localStorage.setItem("employeeId", response.data.id);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role.roleName);

            localStorage.setItem("isLoggedIn", "true");
setIsLoggedIn(true);

            if (response.data.role?.roleName === "ADMIN") {
                localStorage.setItem("userType", "admin");
                navigate("/admin-Dashboard");
            } 
            else if (response.data.role?.roleName === "PAC_MEMBER") {
                localStorage.setItem("userType", "pac");
                navigate("/pac-Dashboard");
            } 
            else if(response.data.role?.roleName==="CHAIRMAN"){

    localStorage.setItem("userType","chairman");

    navigate("/chairman-dashboard");

}
            else {
                localStorage.setItem("userType", "employee");
                navigate("/dashboard");
            }
        }

    } catch (error) {

   if (
    error.response &&
    error.response.data &&
    error.response.data.message === "Already Logged In"
) {

    setShowForceLogin(true);
    return;

} else {

    alert("Invalid Credentials");

}

        } 
    }

  return(
    <>
    <div className="flex justify-center items-center pt-24">
        <div className="bg-white w-[450px] rounded-3xl p-10 shadow-2xl border-t-8 border-orange-600">
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">Sign-in Page</h1>
            <input type="text" placeholder="enter username" className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4 text-gray-800 mb-5 outline-none focus:border-orange-600" value={userId} onChange={(e)=>setUserId(e.target.value)}/>
            <input type="password" placeholder="enter password" className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4 text-gray-800 mb-8 outline-none focus:border-orange-600" value={passw} onChange={(e)=>setPassw(e.target.value)}/>
            <div className="flex justify-center mb-6">
  
</div>
<div className="flex justify-center mb-4">

<img
    src={captchaImage}
    alt="Captcha"
    crossOrigin="use-credentials"
    className="border-2 border-gray-400 rounded-lg h-16 w-48"
/>

</div>
<div className="flex justify-center gap-5">
    <button
className="text-grey-700 bg-amber-100 w-19 px-2 py-4 m-4 border-amber-400 border-2 rounded-xl"
onClick={()=>

setCaptchaImage(
    "http://localhost:8080/api/captcha?t=" + Date.now()
)
}
>

Refresh

</button>
<input

type="text"
className="border-2 bg-amber-100 border-amber-600 w-80 px-4 py-8 m-4 rounded-xl h-8"
placeholder="Enter Captcha"

value={captcha}

onChange={(e)=>

setCaptcha(e.target.value)

}

/>
</div>
            <button
    className={`w-full rounded-xl py-4 duration-300 shadow-lg ${
        userId.trim() && passw.trim()
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-gray-400 cursor-not-allowed"
    }`}
    disabled={!userId.trim() || !passw.trim()}
    onClick={handleLogin}
>
    <span className="text-white font-semibold">
        LOGIN
    </span>
</button>
        </div>
    </div>
    {
showForceLogin && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-blue-100 rounded-2xl shadow-2xl w-[430px] p-8">

        <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Session Already Active
        </h2>

        <p className="text-gray-700 text-lg mb-8">
            This account is already logged in on another device.
            <br /><br />
            Do you want to continue here?
        </p>

        <div className="flex justify-end gap-4">

            <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                onClick={() => setShowForceLogin(false)}
            >
                Cancel
            </button>

            <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                onClick={() => {

                    setShowForceLogin(false);
                    setForceLogin(true);

                    setCaptcha("");
                    setCaptchaImage(
                        "http://localhost:8080/api/captcha?t=" + Date.now()
                    );

                }}
            >
                Continue
            </button>

        </div>

    </div>

</div>

)
}
    </>
  );
}



export default LoginPage