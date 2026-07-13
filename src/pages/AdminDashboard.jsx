import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SessionTimeout from "../components/SessionTimeout";

import ReviewHistoryPage from "./ReviewHistoryPage";

function AdminDashboard({ setIsLoggedIn}) {
      const navigate = useNavigate();
const [option, setOption] = useState(() => {
    return localStorage.getItem("adminOption") || "dashboard";
});
    const [employees, setEmployees] = useState([]);
const [pacMembers, setPacMembers] = useState([]);
const [proposals, setProposals] = useState([]);
const [search, setSearch] = useState("");
const [employeePage, setEmployeePage] = useState(1);
const [editPage, setEditPage] = useState(1);
const [editSearch, setEditSearch] = useState("");
const rowsPerPage = 10;
const [showConfirm, setShowConfirm] = useState(false);
const [selectedMembers, setSelectedMembers] = useState([]);
const [showRemove, setShowRemove] =useState(false);
const [removeId, setRemoveId] = useState(null);
const [showPdf, setShowPdf] = useState(false);
const [chairmanSearch, setChairmanSearch] = useState("");

const [chairmanPage, setChairmanPage] = useState(1);

const [selectedChairman, setSelectedChairman] = useState(null);

const [showChairmanConfirm, setShowChairmanConfirm] = useState(false);

const [showRemoveChairman, setShowRemoveChairman] = useState(false);

const [chairmanIdToRemove, setChairmanIdToRemove] = useState(null);
const [selectedPdf, setSelectedPdf] = useState("");
useEffect(() => {
    loadEmployees();
    loadPacMembers();
    loadProposals();
}, []);

useEffect(() => {
    localStorage.setItem("adminOption", option);
}, [option]);
useEffect(() => {

    const handleBack = () => {

        const previous =
            localStorage.getItem("returnOption");

        if (previous) {

            setOption(previous);

            localStorage.setItem(
                "adminOption",
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

function togglePac(id){

if(selectedMembers.includes(id)){

setSelectedMembers(

selectedMembers.filter(x=>x!==id)

);

}

else{

setSelectedMembers(

[...selectedMembers,id]

);

}

}
async function loadEmployees() {

    const response = await axios.get(
        "http://localhost:8080/api/employees"
    );

    setEmployees(response.data);
}
async function makeChairman(id){

    await axios.put(
        `http://localhost:8080/api/admin/chairman/${id}`
    );

    await loadEmployees();
await loadPacMembers();
}

async function loadPacMembers() {

    const response = await axios.get(
        "http://localhost:8080/api/admin/pac-members"
    );

    setPacMembers(response.data);
    

    setSelectedMembers(

    response.data.map(member => member.employee.id)

    );


}

async function loadProposals() {

    const response = await axios.get(
        "http://localhost:8080/api/proposals"
    );

    setProposals(response.data);
}

async function submitPacMembers() {

    try {

        await axios.post(
            "http://localhost:8080/api/admin/pac-members",
            selectedMembers
        );

        loadEmployees();
        loadPacMembers();

    }
    catch(error){

        console.log(error);

        alert("Failed to update PAC Members.");

    }

}
async function removePacMember(id) {

    await axios.put(
        `http://localhost:8080/api/admin/remove-pac/${id}`
    );

     await loadEmployees();
    await loadPacMembers();
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

    localStorage.removeItem("adminOption");
localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
}
function openPdf(fileName) {

    setSelectedPdf(fileName);

    setShowPdf(true);

}

const filteredEmployees = employees
    .filter(employee => employee.role?.roleName !== "ADMIN")
    .filter(employee =>

        employee.name.toLowerCase().includes(search.toLowerCase()) ||

        employee.email.toLowerCase().includes(search.toLowerCase()) ||

        employee.departmentName.toLowerCase().includes(search.toLowerCase())

    );
const employeeLastIndex = employeePage * rowsPerPage;

const employeeFirstIndex = employeeLastIndex - rowsPerPage;

const currentEmployees =
    filteredEmployees.slice(
        employeeFirstIndex,
        employeeLastIndex
    );

const employeeTotalPages =
    Math.ceil(filteredEmployees.length / rowsPerPage);
    const filteredPacMembers = pacMembers.filter(member =>
    member.employee?.name?.toLowerCase().includes(editSearch.toLowerCase()) ||
    member.employee?.email?.toLowerCase().includes(editSearch.toLowerCase()) ||
    member.employee?.departmentName?.toLowerCase().includes(editSearch.toLowerCase())
);
const editLastIndex = editPage * rowsPerPage;

const editFirstIndex = editLastIndex - rowsPerPage;

const currentPacMembers = filteredPacMembers.slice(

    editFirstIndex,

    editLastIndex

);

const editTotalPages = Math.ceil(

    filteredPacMembers.length / rowsPerPage

);

const chairman = employees.find(employee => employee.chairman);
const chairmanExists = chairman != null;
const filteredChairmen = pacMembers.filter(member =>

    member.employee.name.toLowerCase().includes(chairmanSearch.toLowerCase()) ||

    member.employee.email.toLowerCase().includes(chairmanSearch.toLowerCase()) ||

    member.employee.departmentName.toLowerCase().includes(chairmanSearch.toLowerCase())

);

const chairmanLastIndex = chairmanPage * rowsPerPage;

const chairmanFirstIndex = chairmanLastIndex - rowsPerPage;

const currentChairmen = filteredChairmen.slice(

    chairmanFirstIndex,

    chairmanLastIndex

);

const chairmanTotalPages = Math.ceil(

    filteredChairmen.length / rowsPerPage

);

    return (
        <>
          <SessionTimeout
            setIsLoggedIn={setIsLoggedIn}
        />
        <div className="flex h-screen">
            <div className="w-60 bg-blue-900 text-white p-6">

                <h1 className="text-2xl font-bold mb-10">
                    ADMIN PANEL
                </h1>

               <div className="flex flex-col gap-4">

    <button
        className="bg-blue-700 p-3 rounded-xl"
        onClick={() => setOption("dashboard")}
    >
        Dashboard
    </button>

    <button
        className="bg-blue-700 p-3 rounded-xl"
        onClick={() => {setOption("pacMembers");
            loadPacMembers();
        }}
    >
        PAC Members
    </button>
    <button
    className="bg-blue-700 p-3 rounded-xl"
    onClick={() => {
        setOption("chairman");
        loadPacMembers();
    }}
>
    Chairman
</button>

    <button
        className="bg-blue-700 p-3 rounded-xl"
        onClick={() => {

    setOption("editMembers");

    loadPacMembers();

}}
    >
        Edit Members
    </button>

    <button
        className="bg-blue-700 p-3 rounded-xl"
        onClick={() => setOption("proposals")}
    >
        Proposals
    </button>

    <button
        className="bg-red-600 p-3 rounded-xl"
        onClick={handleLogout}
    >
        Logout
    </button>

          </div>
</div>
         <div className="flex-1 bg-gradient-to-r from-orange-50 via-white to-green-50 overflow-y-auto">

    <div className="px-10 pb-10">
                {
                    option === "dashboard" &&
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900 mb-8">
                            Dashboard
                        </h1>

                        <div className="grid grid-cols-2 gap-8">

                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <h2 className="text-2xl font-bold">
                                    Total Employees
                                </h2>

                                <p className="text-4xl text-orange-600 mt-5">
                                    {employees.length}
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <h2 className="text-2xl font-bold">
                                    PAC Members
                                </h2>

                                <p className="text-4xl text-orange-600 mt-5">
                                    {pacMembers.length}
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <h2 className="text-2xl font-bold">
                                    Chairman
                                </h2>

                                <p className="text-2xl text-orange-600 mt-5">
                                     {chairman ? chairman.name : "Not Assigned"}
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <h2 className="text-2xl font-bold">
                                    Total Proposals
                                </h2>

                                <p className="text-4xl text-orange-600 mt-5">
                                    {proposals.length}
                                </p>
                            </div>

                        </div>

                    </div>
                }

                {
    option === "pacMembers" &&

    <div>

        <h1 className="text-4xl font-bold text-blue-900 mb-8">
            PAC Members
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">


<input

type="text"

placeholder="Search employee..."

className="border-2 border-gray-300 rounded-xl px-4 py-2 w-80"

value={search}

onChange={(e)=>{setSearch(e.target.value);
    setEmployeePage(1);
}}

/>

</div>

            <table className="w-full">

               <thead>

<tr className="border-b bg-blue-900 text-white">

    <th className="p-3">ID</th>

    <th className="p-3">Name</th>

    <th className="p-3">Email</th>

    <th className="p-3">Contact</th>

    <th className="p-3">Department</th>
    <th className="p-3">Designation</th>
<th className="p-3">Division</th>
<th className="p-3">State</th>
<th className="p-3">IP No.</th>
<th className="p-3">Emergency</th>
<th className="p-3">PAC Member</th>


</tr>

</thead>

                <tbody>

{
    [...currentEmployees]
        .sort((a, b) => a.id - b.id)
        .map(employee => (

            <tr
                key={employee.id}
                className="border-b hover:bg-gray-100 text-center"
            >

                <td className="p-3">{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.contactNumber}</td>
                <td>{employee.departmentName}</td>
                <td>{employee.designation}</td>
                <td>{employee.division}</td>
                <td>{employee.stateOfPosting}</td>
                <td>{employee.ipNumber}</td>
                <td>{employee.emergencyContact}</td>
<td> <input type="checkbox" checked={ employee.pacCommitteeMember || selectedMembers.includes(employee.id) } onChange={() => togglePac(employee.id)} disabled={employee.pacCommitteeMember} className="w-5 h-5 cursor-pointer disabled:cursor-not-allowed" /> </td>

                      

            </tr>

        ))
}

</tbody>

            </table>
            <div className="mt-6 flex flex-col gap-3 justify-center items-center">

<button
    className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-xl"
    onClick={() => setShowConfirm(true)}
>
    Submit
</button>
<div className="flex justify-end items-center gap-3 mt-6">

<button
disabled={employeePage===1}
onClick={()=>setEmployeePage(employeePage-1)}
className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
>
Previous
</button>

<span>
Page {employeePage} of {employeeTotalPages}
</span>

<button
disabled={employeePage===employeeTotalPages}
onClick={()=>setEmployeePage(employeePage+1)}
className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
>
Next
</button>

</div>

</div>

        </div>

    </div>
}

{
option === "chairman" &&

<div>

<h1 className="text-4xl font-bold text-blue-900 mb-8">

Chairman

</h1>

<div className="bg-white rounded-2xl shadow-xl p-6">

<div className="flex justify-between mb-6">

<input

type="text"

placeholder="Search PAC Member..."

value={chairmanSearch}

onChange={(e)=>{

setChairmanSearch(e.target.value);

setChairmanPage(1);

}}

className="border rounded-xl px-4 py-2 w-80"

/>

</div>

<table className="w-full">

<thead>

<tr className="bg-blue-900 text-white">

<th>ID</th>

<th>Name</th>

<th>Email</th>

<th>Department</th>

<th>Designation</th>

<th>Chairman</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{

currentChairmen.map(member=>(

<tr

key={member.employee.id}

className="text-center border-b"

>

<td>{member.employee.id}</td>

<td>{member.employee.name}</td>

<td>{member.employee.email}</td>

<td>{member.employee.departmentName}</td>

<td>{member.employee.designation}</td>

<td>

<input

type="checkbox"

checked={

selectedChairman===member.employee.id

}

onChange={()=>{

setSelectedChairman(

member.employee.id

);

}}

/>

</td>

<td>

{

member.employee.chairman &&

<button

className="bg-red-600 text-white px-4 py-2 rounded"

onClick={()=>{

setChairmanIdToRemove(

member.employee.id

);

setShowRemoveChairman(true);

}}

>

Remove Chairman

</button>

}

</td>

</tr>

))

}

</tbody>

</table>

<div className="flex justify-between items-center mt-8">

<button

disabled={chairmanPage===1}

onClick={()=>setChairmanPage(chairmanPage-1)}

className="bg-blue-700 text-white px-4 py-2 rounded"

>

Previous

</button>

<span>

Page {chairmanPage} of {chairmanTotalPages}

</span>

<button

disabled={chairmanPage===chairmanTotalPages}

onClick={()=>setChairmanPage(chairmanPage+1)}

className="bg-blue-700 text-white px-4 py-2 rounded"

>

Next

</button>

</div>

<div className="flex justify-center mt-8">

<button

className="bg-green-700 text-white px-6 py-3 rounded-xl"

onClick={()=>setShowChairmanConfirm(true)}

>

Submit

</button>

</div>

</div>

</div>

}

  {
option === "editMembers" &&

<div>

    <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Edit Members
    </h1>

    <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">

<h2 className="text-2xl font-bold">
PAC Members
</h2>

<input
type="text"
placeholder="Search PAC Member..."
value={editSearch}
onChange={(e)=>{
    setEditSearch(e.target.value);
    setEditPage(1);
}}
className="border rounded-xl px-4 py-2 w-80"
/>

</div>
        

        <table className="w-full">

            <thead>

                <tr className="border-b">

                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Designation</th>
                    <th className="p-3 text-left">Chairman</th>
<th className="p-3 text-left">Division</th>
<th className="p-3 text-left">State</th>
<th className="p-3 text-left">Permanent Address</th>
<th className="p-3 text-left">IP No.</th>
<th className="p-3 text-left">Emergency Contact</th>

                </tr>

            </thead>

            <tbody>

                {
                    [...currentPacMembers]
    .sort((a, b) => a.employee.id - b.employee.id)
    .map(member => (
                        <tr
                            key={member.employee.id}
                            className="border-b"
                        >

                            <td className="p-3">
                                {member.employee.id}
                            </td>

                            <td className="p-3">
                                {member.employee.name}
                            </td>

                            <td className="p-3">
                                {member.employee.email}
                            </td>

                            <td className="p-3">
                                {member.employee.departmentName}
                            </td>

                            <td className="p-3">{member.employee.designation}</td>
                            <td className="p-3">
    {member.employee.chairman ? "True" : "False"}
</td>
<td className="p-3">{member.employee.division}</td>
<td className="p-3">{member.employee.stateOfPosting}</td>
<td className="p-3">{member.employee.permanentAddress}</td>
<td className="p-3">{member.employee.ipNumber}</td>
<td className="p-3">{member.employee.emergencyContact}</td>

                            <td className="p-3">

                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                    onClick={() => {
        setRemoveId(member.employee.id);
        setShowRemove(true);
    }}
                                >
                                    Remove PAC
                                </button>

                            </td>

                        </tr>

                    ))
                }

            </tbody>

        </table>
        <div className="flex justify-center items-center gap-3 mt-6">

<button
disabled={editPage===1}
onClick={()=>setEditPage(editPage-1)}
className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
>
Previous
</button>

<span>

Page {editPage} of {editTotalPages}

</span>

<button
disabled={editPage===editTotalPages}
onClick={()=>setEditPage(editPage+1)}
className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
>
Next
</button>

</div>

    </div>

</div>

}       
 {
                    option === "proposals" &&

                   <div className="flex-1 p-10">

    <h1 className="text-5xl font-bold text-[#0B2C84] mb-8">
        Proposals
    </h1>

    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <table className="w-full">

            <thead className="bg-[#0B2C84] text-white">

                <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Coordinator</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Review</th>
                    <th className="p-4">Proposal</th>
                </tr>

            </thead>

            <tbody>

                {proposals.map((proposal) => (

                    <tr
                        key={proposal.id}
                        className="border-b hover:bg-gray-100 text-center"
                    >

                        <td className="p-4">
                            {proposal.employeeName}
                        </td>

                        <td className="p-4">
                            {proposal.title}
                        </td>

                        <td className="p-4">
                            {proposal.departmentName}
                        </td>

                        <td className="p-4">
                            {proposal.projectCoordinator}
                        </td>

                        <td className="p-4">

                            <span
                                className={`px-3 py-1 rounded-full text-white font-semibold
                                ${
                                    proposal.status==="APPROVED"
                                    ? "bg-green-600"
                                    : proposal.status==="UNDER_REVIEW"
                                    ? "bg-yellow-500"
                                    : proposal.status==="CHANGES_REQUIRED"
                                    ? "bg-red-600"
                                    : "bg-blue-600"
                                }`}
                            >

                                {proposal.status}

                            </span>

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
        "adminOption",
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
                    </tr>

                ))}

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
        </div>

        {
showConfirm && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-blue-100 rounded-2xl shadow-2xl w-[430px] p-8">

        <h2 className="text-2xl font-bold text-blue-900 mb-4">

            Confirm Update

        </h2>

        <p className="text-gray-700 text-lg mb-8">

            Are you sure you want to update the PAC Members?

        </p>

        <div className="flex justify-end gap-4">

            <button

                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"

                onClick={() => setShowConfirm(false)}

            >

                Cancel

            </button>

            <button

                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"

                onClick={async () => {

                    setShowConfirm(false);

                    await submitPacMembers();

                }}

            >

                Confirm

            </button>

        </div>

    </div>

</div>

)
}

{
showRemove && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-blue-100 rounded-2xl shadow-2xl w-[430px] p-8">

        <h2 className="text-2xl font-bold text-blue-900 mb-4">

            Confirm Update

        </h2>

        <p className="text-gray-700 text-lg mb-8">

            Are you sure you want to remove the PAC Members?

        </p>

        <div className="flex justify-end gap-4">

            <button

                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"

                onClick={() => setShowRemove(false)}

            >

                Cancel

            </button>

            <button

                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"

                onClick={async () => {

    setShowRemove(false);

    await removePacMember(removeId);

    setRemoveId(null);

}}

            >

                Confirm

            </button>

        </div>

    </div>

</div>

)
}

{
showChairmanConfirm && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center">

<div className="bg-white rounded-xl p-8">

<h2 className="text-2xl font-bold">

Confirm Chairman

</h2>

<p className="mt-4">

Make this PAC member the Chairman?

</p>

<div className="flex justify-end gap-4 mt-6">

<button

className="bg-gray-500 text-white px-5 py-2 rounded"

onClick={()=>setShowChairmanConfirm(false)}

>

Cancel

</button>

<button

className="bg-green-600 text-white px-5 py-2 rounded"

onClick={async()=>{

await makeChairman(selectedChairman);

setShowChairmanConfirm(false);

}}

>

Confirm

</button>

</div>

</div>

</div>

)
}

{
showRemoveChairman && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center">

<div className="bg-white rounded-xl p-8">

<h2 className="text-2xl font-bold">

Remove Chairman

</h2>

<p className="mt-4">

Remove Chairman?

</p>

<div className="flex justify-end gap-4 mt-6">

<button

className="bg-gray-500 text-white px-5 py-2 rounded"

onClick={()=>setShowRemoveChairman(false)}

>

Cancel

</button>

<button

className="bg-red-600 text-white px-5 py-2 rounded"

onClick={async()=>{

await axios.put(

`http://localhost:8080/api/admin/remove-chairman/${chairmanIdToRemove}`

);

await loadEmployees();

await loadPacMembers();

alert("Chairman removed successfully.");

setShowRemoveChairman(false);

}}

>

Remove

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
        </>

    );

    }


export default AdminDashboard;