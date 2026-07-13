import { useState, useEffect } from "react";
import SessionTimeout from "../components/SessionTimeout";
import axios from "axios";
import ReviewHistoryPage from "./ReviewHistoryPage";
import { useNavigate } from "react-router-dom";

function DashboardPage({setIsLoggedIn }) {
    const navigate = useNavigate();
const [option, setOption] = useState(() => {
    return localStorage.getItem("employeeOption") || "dashboard";
});
    const [proposals, setProposals] = useState([]);
    const [employee, setEmployee] = useState(() => {
    return JSON.parse(localStorage.getItem("employee"));
});
const [showPdf, setShowPdf] = useState(false);

const [selectedPdf, setSelectedPdf] = useState("");

    const [myProposals,setMyProposals]=useState([]);
 useEffect(() => {

    loadEmployee();
    loadMyProposals();

}, []);
useEffect(() => {

    const handleBack = () => {

        const previous =
            localStorage.getItem("returnOption");

        if (previous) {

            setOption(previous);

            localStorage.setItem(
                "employeeOption",
                previous
            );
        }

    };

    window.addEventListener(
        "popstate",
        handleBack
    );

    return () =>
        window.removeEventListener(
            "popstate",
            handleBack
        );

}, []);
useEffect(() => {
    localStorage.setItem("employeeOption", option);
}, [option]);


async function loadEmployee() {

    const id = localStorage.getItem("employeeId");

    if (!id || id === "null") {
        console.log("Invalid employeeId in localStorage");
        return;
    }

    try {
        const response = await axios.get(
            `http://localhost:8080/api/employees/${id}`
        );

        setEmployee(response.data);

        localStorage.setItem("employee", JSON.stringify(response.data));

    } catch (error) {
        console.log(error);
    }
}
async function loadMyProposals() {
    try {
        const employeeId = localStorage.getItem("employeeId");

        if (!employeeId || employeeId === "null") {
            console.log("Invalid employeeId in localStorage");
            return; 
        }

        const response = await axios.get(
            `http://localhost:8080/api/proposals/employee/${employeeId}`
        );

        setMyProposals(response.data);
    } catch (error) {
        console.log(error);
    }
}

   
    async function handleLogout() {

    try{
       await axios.post(
    "http://localhost:8080/api/employees/logout",
    null,
    {
        withCredentials: true
    }
);
    }
    catch(error){
        console.log(error);
    }

   localStorage.removeItem("employeeOption");
localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
}

    return (
        <>
        <SessionTimeout
            setIsLoggedIn={setIsLoggedIn}
        />

        <div className="flex h-screen">
            <div className="w-60 bg-blue-900 text-white p-6">
                <h1 className="text-3xl font-bold mb-10">
                    EMPLOYEE PANEL
                </h1>
                <div className="flex flex-col gap-4">
                    <button
                        className="bg-blue-700 p-3 rounded-xl"
                        onClick={() => {
    setOption("dashboard");
    localStorage.setItem("employeeOption", "dashboard");
}}
                    >
                        Dashboard
                    </button>
                    <button
    className="bg-blue-700 p-3 rounded-xl"
 onClick={() => {

    localStorage.setItem("employeeOption", option);

    localStorage.setItem("currentPage", "proposal");

    localStorage.setItem("userType", "employee");

    navigate("/proposal");

}}
>
    Submit Proposal
</button>
                    <button
    className="bg-blue-700 p-3 rounded-xl"
   onClick={() => {
    setOption("myProposals");
    localStorage.setItem("employeeOption", "myProposals");
    loadMyProposals();
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
            <div className="flex-1 bg-gradient-to-br from-orange-100 via-white to-green-100 p-10">
                {
                    option === "dashboard" &&
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900 mb-8">
                            Dashboard
                        </h1>
                        <div className="bg-white rounded-3xl shadow-xl p-8">

    <h2 className="text-3xl font-bold text-orange-600 mb-8">

        Welcome, {employee?.name}

    </h2>

    <div className="grid grid-cols-2 gap-8">

        <div>

            <p className="font-bold text-blue-900">
                Employee ID
            </p>

            <p>{employee?.id}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                Username
            </p>

            <p>{employee?.username}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                Name
            </p>

            <p>{employee?.name}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                Email
            </p>

            <p>{employee?.email}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                Contact Number
            </p>

            <p>{employee?.contactNumber}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                Department
            </p>

            <p>{employee?.departmentName}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                Role
            </p>

            <p>{employee?.role?.roleName}</p>

        </div>

        <div>

            <p className="font-bold text-blue-900">
                PAC Member
            </p>

            <p>

                {employee?.pacCommitteeMember
                    ? "Yes"
                    : "No"}

            </p>

        </div>

    </div>

</div>

                    </div>
                }

        
                {
option==="myProposals" &&(

<div>

<h1 className="text-4xl font-bold text-blue-900 mb-8">

My Proposals

</h1>

<div className="bg-white rounded-3xl shadow-xl p-6">

<table className="w-full">

<thead className="bg-blue-900 text-white">

<tr>

<th className="p-4">Title</th>

<th>Status</th>
<th>
    Review
</th>

<th>Files</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{

myProposals.map((proposal)=>(

<tr
key={proposal.id}
className="border-b text-center"
>

<td className="p-4">

{proposal.title}

</td>

<td>

{proposal.status}

</td>

<td>
<button
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
 onClick={() => {
    localStorage.setItem(
        "returnOption",
        option
    );

    localStorage.setItem(
        "selectedProposalId",
        proposal.id
    );

    localStorage.setItem(
        "employeeOption",
        "reviewHistory"
    );

    window.history.pushState(
        { option: "reviewHistory" },
        ""
    );

    setOption("reviewHistory");

}}
>
    Review
</button>

</td>

<td>

{proposal.file.split(",").map((fileName, index) => (

    <div
        key={index}
        className="mb-2"
    >

        <button
            className="text-blue-600 underline hover:text-blue-800 font-medium"
            onClick={() => {
                setSelectedPdf(fileName);
                setShowPdf(true);
            }}
        >
            View PDF
        </button>
    </div>

))}

</td>

<td>

{

proposal.status==="CHANGES_REQUIRED" &&

<button

className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"

onClick={()=>{

localStorage.setItem(

"resubmitProposal",

JSON.stringify(proposal)

);

localStorage.setItem(

"userType",

"employee"

);
localStorage.setItem(
    "employeeOption",
    "myProposals"
);


navigate("/proposal");

}}

>

Resubmit

</button>

}

{

proposal.status==="UNDER_REVIEW" &&

<span className="text-yellow-600 font-bold">

Waiting

</span>

}

{

proposal.status==="APPROVED" &&

<span className="text-green-600 font-bold">

Approved

</span>

}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>
    )
}

{
option === "reviewHistory" &&

<ReviewHistoryPage
    proposalId={
        Number(localStorage.getItem("selectedProposalId"))
    }
/>

}


</div>
</div>
{

showPdf && (

<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

<div className="bg-white rounded-3xl shadow-2xl w-[90%] h-[90%] flex flex-col overflow-hidden">

<div className="bg-blue-900 text-white flex justify-between items-center px-6 py-4">

<h2 className="text-xl font-bold">

{selectedPdf}

</h2>

<div className="flex gap-3">

<button

className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded"

onClick={async () => {

    const response = await axios.get(
        `http://localhost:8080/uploads/${selectedPdf}`,
        {
            responseType: "blob"
        }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");

    link.href = url;
    link.download = selectedPdf;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

}}

>

Download

</button>

<button

className="bg-gray-700 hover:bg-gray-800 w-10 h-10 rounded-full"

onClick={() => setShowPdf(false)}

>

✕

</button>

</div>

</div>

<div className="flex-1">

<iframe
    src={`http://localhost:8080/uploads/${encodeURIComponent(selectedPdf)}#toolbar=0&navpanes=0&scrollbar=0`}
    className="w-full h-full"
    title="PDF Viewer"
/>

</div>

</div>

</div>

)

}
        </>
    );
}

export default DashboardPage;