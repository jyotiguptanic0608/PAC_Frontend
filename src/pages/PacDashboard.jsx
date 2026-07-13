import { useEffect, useState } from "react";
import axios from "axios";
import SessionTimeout from "../components/SessionTimeout";
import ReviewHistoryPage from "./ReviewHistoryPage";
import { useNavigate } from "react-router-dom";

function PacDashboard({setIsLoggedIn }) {
     const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
const [option, setOption] = useState(() => {
    return localStorage.getItem("pacOption") || "dashboard";
});
    const [pacMemberDetails, setPacMemberDetails] = useState(null);
    const [myProposals, setMyProposals] = useState([]);
    const [showReviewBox, setShowReviewBox] = useState(false);
const [reviewText, setReviewText] = useState("");
const [selectedProposalId, setSelectedProposalId] = useState(null);
const [showPdf, setShowPdf] = useState(false);

const [selectedPdf, setSelectedPdf] = useState("");

const [showApproveBox, setShowApproveBox] = useState(false);
const [approveProposalId, setApproveProposalId] = useState(null);

const [showApproveSuccess, setShowApproveSuccess] = useState(false);
useEffect(() => {
    loadPacMemberDetails();
    fetchProposals();
    loadMyProposals();
}, []);
    
useEffect(() => {

    const handleBack = () => {

        const previous =
            localStorage.getItem("returnOption");

        if(previous){

            setOption(previous);

            localStorage.setItem(
                "pacOption",
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
    async function loadMyProposals() {

    try {

        const employeeId =
            localStorage.getItem("employeeId");

        const response =
            await axios.get(
                `http://localhost:8080/api/proposals/employee/${employeeId}`
            );

        setMyProposals(response.data);

    }

    catch(error){

        console.log(error);

    }

}

    async function loadPacMemberDetails() {

    try{

        const id = localStorage.getItem("employeeId");

        if(!id){

            return;

        }

        const response = await axios.get(

            `http://localhost:8080/api/employees/${id}`

        );

        setPacMemberDetails(response.data);

    }

    catch(error){

        console.log(error);

    }

}

    async function fetchProposals() {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/proposals"
            );

            setProposals(response.data);

        } catch (error) {

            console.log(error);

        }
    }

    async function reviewProposal() {

    if (reviewText.trim() === "") {
        alert("Please enter review.");
        return;
    }

    try {

  await axios.put(
    `http://localhost:8080/api/proposals/${selectedProposalId}/review`,
    {
        review: reviewText,
        reviewerId: Number(localStorage.getItem("employeeId"))
    }
);

       fetchProposals();
loadMyProposals();

setShowReviewBox(false);
        setReviewText("");
        setSelectedProposalId(null);

    } catch (error) {

        console.log(error);

    }
}
async function approveProposal() {

    try {

        await axios.put(
            `http://localhost:8080/api/proposals/${approveProposalId}/approve`
        );

        fetchProposals();
        loadMyProposals();

        setShowApproveBox(false);

        setApproveProposalId(null);

        setShowApproveSuccess(true);

    }

    catch(error){

        console.log(error);

    }

}

    function openPdf(fileName) {

    setSelectedPdf(fileName);

    setShowPdf(true);

}

    async function logout() {

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

    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
}

    return (
        <> 
        <SessionTimeout
       
            setIsLoggedIn={setIsLoggedIn}
        />


        <div className="flex min-h-screen">

            <div className="w-60 bg-blue-900 text-white p-6">

                <h1 className="text-2xl font-bold mb-10">
                    PAC MEMBER PANEL
                </h1>

                <div className="flex flex-col gap-4">
<button
    className="bg-blue-700 p-3 rounded-xl"
    onClick={() => {

    localStorage.removeItem("returnOption");
    localStorage.removeItem("resubmitProposal");

    localStorage.setItem("pacOption","dashboard");

    setOption("dashboard");

}}
>
    Dashboard
</button>

                    <button
                        className="bg-blue-700 p-3 rounded-xl"
                     onClick={() => {

    localStorage.removeItem("resubmitProposal");

    localStorage.setItem("userType", "pac");
   

    navigate("/proposal");

}}
                    >
                        Submit Proposal
                    </button>
                    <button
    className="bg-blue-700 p-3 rounded-xl"
onClick={async () => {

    await loadMyProposals();

    localStorage.setItem("pacOption","myProposals");

    setOption("myProposals");

}}
>
    My Proposals
</button>

                    <button
                        className="bg-blue-700 p-3 rounded-xl"
  onClick={async () => {

    await fetchProposals();

    localStorage.setItem("pacOption","review");

    setOption("review");

}}
                    >
                        Review Proposals
                    </button>

                    <button
                        className="bg-red-600 p-3 rounded-xl"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

            <div className="flex-1 bg-gradient-to-br from-orange-100 via-white to-green-100 p-10">

               {
option==="dashboard" &&

<div>

<h1 className="text-4xl font-bold text-blue-900 mb-8">

Dashboard

</h1>

<div className="bg-white rounded-3xl shadow-xl p-8">

<h2 className="text-3xl font-bold text-orange-600 mb-8">

Welcome, {pacMemberDetails?.name}

</h2>

<div className="grid grid-cols-2 gap-8">

<div>

<p className="font-bold text-blue-900">

Employee ID

</p>

<p>

{pacMemberDetails?.id}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

Username

</p>

<p>

{pacMemberDetails?.username}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

Name

</p>

<p>

{pacMemberDetails?.name}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

Email

</p>

<p>

{pacMemberDetails?.email}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

Contact Number

</p>

<p>

{pacMemberDetails?.contactNumber}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

Department

</p>

<p>

{pacMemberDetails?.departmentName}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

Role

</p>

<p>

{pacMemberDetails?.role?.roleName}

</p>

</div>

<div>

<p className="font-bold text-blue-900">

PAC Committee Member

</p>

<p>

{pacMemberDetails?.pacCommitteeMember ? "Yes" : "No"}

</p>

</div>

</div>

</div>

</div>

}
                {option === "review" && (

                    <div>

                        <h1 className="text-4xl font-bold text-blue-900 mb-8">
                            Review Proposals
                        </h1>

                        <table className="w-full bg-white rounded-xl shadow">

                            <thead className="bg-blue-900 text-white">

                                <tr>

                                    <th className="p-3">Name</th>
                                    <th>DeptName</th>
                                    <th>Title</th>
                                    <th>Status</th>
   <th>
    Review
</th>
                                    <th>File</th>
                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    proposals.map((proposal) => (

                                        <tr
                                            key={proposal.id}
                                            className="text-center border-b"
                                        >

                                           <td>{proposal.employeeName}</td>
                                            <td>
                                                {proposal.departmentName}
                                            </td>

                                            <td>
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
        "pacOption",
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

                                               {proposal.file.split(",").map((fileName,index)=>(

<div
    key={index}
    className="mb-2"
>

<button

className="text-blue-700 underline hover:text-blue-900"

onClick={() => openPdf(fileName)}

>

View PDF

</button>

</div>

))}
                                            </td>

                                            <td>

                                                <div className="flex justify-center gap-2">

                                                   <button
    className={`px-3 py-2 rounded text-white ${
        proposal.status === "APPROVED"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
    }`}
    disabled={proposal.status === "APPROVED"}
    onClick={() => {
        if (proposal.status === "APPROVED") return;

        setSelectedProposalId(proposal.id);
        setReviewText("");
        setShowReviewBox(true);
    }}
>
    Add Remarks
</button>
                                                 <button
    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
    onClick={() => {
        setApproveProposalId(proposal.id);
        setShowApproveBox(true);
    }}
>
    Approve
</button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                )}
                {
option==="myProposals" &&

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

<th>Review</th>

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
        "pacOption",
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
          onClick={() => openPdf(fileName)}
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
    "pac"
);

localStorage.setItem(
    "pacOption",
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

}
{
option === "reviewHistory" && (

    <ReviewHistoryPage
        proposalId={
            Number(localStorage.getItem("selectedProposalId"))
        }
    />

)
}

            </div>

        </div>
        {
showReviewBox && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white rounded-2xl shadow-2xl w-[500px] p-8">

        <h2 className="text-2xl font-bold text-blue-900 mb-5">
            Review Proposal
        </h2>

        <textarea
            className="w-full border-2 border-gray-300 rounded-xl p-4 h-40"
            placeholder="Enter your review..."
            value={reviewText}
            onChange={(e)=>setReviewText(e.target.value)}
        />

        <div className="flex justify-end gap-4 mt-6">

            <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                onClick={()=>{
                    setShowReviewBox(false);
                    setReviewText("");
                    setSelectedProposalId(null);
                }}
            >
                Cancel
            </button>

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                onClick={reviewProposal}
            >
                OK
            </button>

        </div>

    </div>

</div>

)
}
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

onClick={() => {setShowPdf(false);
setSelectedPdf("");}}

>

✕

</button>

</div>

</div>

<div className="flex-1">

<iframe
    src={`http://localhost:8080/uploads/${encodeURIComponent(selectedPdf)}#toolbar=0&navpanes=0`}
    className="w-full h-full"
    title="PDF Viewer"
/>

</div>

</div>

</div>

)

}
{
showApproveBox && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white rounded-2xl shadow-2xl w-[450px] p-8">

        <h2 className="text-2xl font-bold text-blue-900 mb-5">
            Approve Proposal
        </h2>

        <p className="text-lg text-gray-700">
            Are you sure you want to approve this proposal?
        </p>

        <div className="flex justify-end gap-4 mt-8">

            <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                onClick={() => {
                    setShowApproveBox(false);
                    setApproveProposalId(null);
                }}
            >
                Cancel
            </button>

            <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                onClick={approveProposal}
            >
                Confirm
            </button>

        </div>

    </div>

</div>

)
}
{
showApproveSuccess && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-8 text-center">

        <h2 className="text-2xl font-bold text-green-700 mb-4">
            ✓ Approved Successfully
        </h2>

        <p className="text-gray-700 mb-6">
            The proposal has been approved successfully.
        </p>

        <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
            onClick={() => setShowApproveSuccess(false)}
        >
            OK
        </button>

    </div>

</div>

)
}
</>
    );

}

export default PacDashboard;