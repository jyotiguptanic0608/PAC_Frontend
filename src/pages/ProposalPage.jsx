import {useEffect,useState} from "react";
import { saveProposal } from "../services/proposalService";
import SessionTimeout from "../components/SessionTimeout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProposalPage({setIsLoggedIn }) {
const navigate = useNavigate();
    const [deptname, setDeptname] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [descp, setDescp] = useState("");
    const [files, setFile] = useState([]);
    const [message, setMessage] = useState("");
    const [groupHeadName, setGroupHeadName] = useState("");
    const [projectCoordinator, setProjectCoordinator] = useState("");
    const userType = localStorage.getItem("userType");
   
    async function handleLogout() {

    try {
        await axios.post("http://localhost:8080/api/employees/logout");
    } catch (error) {
        console.log(error);
    }

    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
}

    useEffect(()=>{

const proposal=

JSON.parse(

localStorage.getItem("resubmitProposal")

);

if(proposal){

setDeptname(proposal.departmentName);

setTitle(proposal.title);

setGroupHeadName(proposal.groupHeadName);

setProjectCoordinator(proposal.projectCoordinator);

setDate(proposal.date);

setDescp(proposal.description);

localStorage.removeItem("resubmitProposal");

}

},[]);


function handleFileChange(e) {

    const selectedFiles = Array.from(e.target.files);

    const validFiles = [];

    for (const file of selectedFiles) {

        if (file.type !== "application/pdf") {

            alert(file.name + " is not a PDF.");

            continue;

        }

        validFiles.push(file);

    }

    setFile(prev => [...prev, ...validFiles]);

}
function removeFile(index){

    setFile(

        files.filter((_,i)=>i!==index)

    );

}

    async function handleSubmit() {

       if(files.length===0){

    alert("Please upload at least one PDF.");

    return;

}

        const formData = new FormData();

        formData.append("departmentName", deptname);
        formData.append("groupHeadName", groupHeadName);
        formData.append("projectCoordinator", projectCoordinator);
        formData.append("title", title);
        formData.append("date", date);
        formData.append("description", descp);
        const employeeId = localStorage.getItem("employeeId");

if (!employeeId || employeeId === "null") {
    alert("Employee ID missing. Please login again.");
    return;
}

formData.append("employeeId", employeeId);
        files.forEach(file=>{

    formData.append("files",file);

});

        try {

            await saveProposal(formData);

  setMessage("Proposal submitted successfully");

setTimeout(() => {

    const userType = localStorage.getItem("userType");
if (userType === "employee") {

    localStorage.setItem("employeeOption", "dashboard");
    navigate("/dashboard");

}
else if (userType === "pac") {

    localStorage.setItem("pacOption", "dashboard");
    navigate("/pac-Dashboard");

}
else if (userType === "admin") {

    localStorage.setItem("adminOption", "dashboard");
    navigate("/admin-Dashboard");

}

}, 1500); 
}catch (error) {

            alert("Submission Failed");
        }
    }
    return (
        <>
    <SessionTimeout
      
        setIsLoggedIn={setIsLoggedIn}
    />
        <div className="flex min-h-screen">


     {
    userType === "employee" &&
    <div className="w-60 bg-blue-900 text-white p-6">
    <h1 className="text-3xl font-bold mb-10">
        EMPLOYEE PANEL
    </h1>

    <div className="flex flex-col gap-4">

        <button
            className="bg-blue-700 p-3 rounded-xl"
           onClick={() => {
     localStorage.setItem("employeeOption", "dashboard");
    navigate("/dashboard");
}}
        >
            Dashboard
        </button>

        <button
            className="bg-blue-700 p-3 rounded-xl"
        >
            Submit Proposal
        </button>

        <button
            className="bg-blue-700 p-3 rounded-xl"
            onClick={() => {
    localStorage.setItem("employeeOption", "myProposals");
    
    navigate("/dashboard");
}}
        >
            My Proposals
        </button>
        <button
            className="bg-red-600 p-3 rounded-xl"
            onClick={handleLogout}
        >
            Logout
        </button>

    </div>
</div>
}
    {
    userType === "pac" &&
    <div className="w-60 bg-blue-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
            PAC MEMBER PANEL
        </h1>

        <div className="flex flex-col gap-4">

            <button
                className="bg-blue-700 p-3 rounded-xl"
              onClick={() => {

    localStorage.setItem("pacOption","dashboard");

    navigate("/pac-Dashboard",{
        replace:true
    });

}}
            >
                Dashboard
            </button>

            <button
                className="bg-blue-700 p-3 rounded-xl"
            >
                Submit Proposal
            </button>

         <button
    className="bg-blue-700 p-3 rounded-xl"
      onClick={() => {

        localStorage.setItem("pacOption","myProposals");
        navigate("/pac-Dashboard");

    }}
>
    My Proposals
</button>

            <button
                className="bg-blue-700 p-3 rounded-xl"
                onClick={() => {
    localStorage.setItem("pacOption", "review");
  
    navigate("/pac-Dashboard");
}}
            >
                Review Proposals
            </button>

            <button
                className="bg-red-600 p-3 rounded-xl"
                onClick={handleLogout}
            >
                Logout
            </button>

        </div>

    </div>
}
    <div className="flex-1 bg-gradient-to-br from-orange-100 via-white to-green-100 flex justify-center items-start pt-8">

       <div className="bg-slate-900 w-[1150px] min-h-[680px] rounded-3xl p-6 shadow-2xl">

                    <div className="flex justify-between items-center mb-12">

    <h1 className="text-4xl font-bold text-orange-700">
        PROPOSAL
    </h1>

</div>
<div className="grid grid-cols-2 gap-9 items-start">

    <input
        type="text"
        placeholder="Enter Department Name"
        className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4"
        value={deptname}
        onChange={(e)=>setDeptname(e.target.value)}
    />

    <input
        type="text"
        placeholder="Enter Group Head Name"
        className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4"
        value={groupHeadName}
        onChange={(e)=>setGroupHeadName(e.target.value)}
    />

    <input
        type="text"
        placeholder="Enter Project Coordinator"
        className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4"
        value={projectCoordinator}
        onChange={(e)=>setProjectCoordinator(e.target.value)}
    />

    <input
        type="text"
        placeholder="Enter Proposal Title"
        className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
    />

    <div className="self-start">
    <input
        type="date"
        className="w-full bg-orange-50 border-2 border-orange-300 rounded-xl p-4 h-14"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
    />
</div>

<div>

    <label
        className="block bg-blue-600 hover:bg-blue-700 text-white
                   px-6 py-4 rounded-xl cursor-pointer shadow-lg
                   text-center"
    >

        + Add Proposal Files

        <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
        />

    </label>

</div>
<div className="mt-1">

    <textarea
        className="w-full h-36 bg-orange-50 border-2
                   border-orange-300 rounded-xl p-4"
        placeholder="Enter Description"
        value={descp}
        onChange={(e)=>setDescp(e.target.value)}
    />

</div>
<div className="mt-1">

    <h2 className="text-white text-xl font-semibold mb-4">
        Uploaded Files
    </h2>

    <div className="space-y-3 min-h-48 overflow-y-auto">

        {
            files.map((file,index)=>(

                <div
                    key={index}
                    className="flex justify-between items-center
                               bg-white border-2 border-blue-400
                               rounded-xl p-4"
                >

                    <span className="text-blue-900 font-medium">
                        {file.name}
                    </span>

                    <button
                        className="bg-red-600 hover:bg-red-700
                                   text-white px-4 py-2 rounded-lg"
                        onClick={()=>removeFile(index)}
                    >
                        Remove
                    </button>

                </div>

            ))
        }

    </div>

</div>
</div>
<div className="col-span-2 flex justify-center mt-8">

    <button
        className="bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold px-12 py-4 rounded-xl"
        onClick={handleSubmit}
    >
        Submit Proposal
    </button>

</div>
                    {
    message &&

    <p className="text-green-600 text-center mt-5 text-lg font-semibold">
        {message}
    </p>
}


</div>

</div>


        </div>
                    
        </>
    );
}

export default ProposalPage;