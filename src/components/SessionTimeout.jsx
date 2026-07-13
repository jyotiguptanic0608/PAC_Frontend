import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function SessionTimeout({setIsLoggedIn }) {
     const navigate = useNavigate();

    useEffect(() => {

        let timer;

        async function logoutUser() {

    alert("Session expired due to inactivity.");

    try{
        await axios.post("http://localhost:8080/api/employees/logout");
    }
    catch(error){
        console.log(error);
    }

    localStorage.clear();

    setIsLoggedIn(false);

    navigate("/login");

}

        function resetTimer() {

            clearTimeout(timer);

            timer = setTimeout(logoutUser, 10 * 60 * 1000);
        }

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        resetTimer();

        return () => {

            clearTimeout(timer);

            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);

        };

    }, []);

    return null;

}

export default SessionTimeout;