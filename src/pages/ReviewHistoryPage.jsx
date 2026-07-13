import { useEffect, useState } from "react";
import axios from "axios";

function ReviewHistoryPage({ proposalId }) {

    const [proposal, setProposal] = useState(null);
    const [showPdf, setShowPdf] = useState(false);

const [selectedPdf, setSelectedPdf] = useState("");


 useEffect(() => {
    loadProposal();
}, [proposalId]);

    async function loadProposal() {

        try {

            const response = await axios.get(
                `http://localhost:8080/api/proposals/${proposalId}`
            );

            setProposal(response.data);

        }
        catch (error) {

            console.log(error);

        }

    }
    
    function openPdf(fileName) {

    setSelectedPdf(fileName);

    setShowPdf(true);

}

    return (

        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 p-10">

      
            <h1 className="text-4xl font-bold text-blue-900 mb-8">

                Proposal Review History

            </h1>

            {
                proposal &&

                <>

                    <div className="bg-white rounded-xl shadow p-6 mb-8">

                        <h2 className="text-2xl font-bold mb-4">

                            Proposal Details

                        </h2>

                        <p><b>Title :</b> {proposal.title}</p>

                        <p><b>Status :</b> {proposal.status}</p>

                        <p><b>Department :</b> {proposal.departmentName}</p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6 mb-8">

                        <h2 className="text-2xl font-bold mb-4">

                            Review History

                        </h2>

                        <table className="w-full border">

                            <thead className="bg-blue-900 text-white">

                                <tr>

                                    <th className="p-3">Date</th>

                                    <th>Reviewer</th>

                                    <th>Remarks</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    proposal.reviews &&
                                    proposal.reviews.map(review => (

                                        <tr
                                            key={review.id}
                                            className="border-b text-center"
                                        >

                                            <td>

                                                {
                                                    new Date(
                                                        review.reviewDate
                                                    ).toLocaleString()
                                                }

                                            </td>

                                            <td>

                                                {review.reviewer.name}

                                            </td>

                                            <td>

                                                {review.remarks}

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-2xl font-bold mb-4">

                            Proposal Versions

                        </h2>

                        <table className="w-full border">

                            <thead className="bg-blue-900 text-white">

                                <tr>

                                    <th className="p-3">

                                        Version

                                    </th>

                                    <th>

                                        Proposal File

                                    </th>

                                    <th>

                                        Action

                                    </th>

                                </tr>

                            </thead>

                           <tbody>

{proposal.file.split(",").map((fileName, index) => (

<tr
    key={index}
    className="border-b text-center"
>

<td>
    Version {index + 1}
</td>

<td>
    {fileName}
</td>

<td>

<button
    className="text-blue-700 underline hover:text-blue-900"
    onClick={() => openPdf(fileName)}
>
    View PDF
</button>

</td>

</tr>

))}

</tbody>

                        </table>

                    </div>

                </>

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

        </div>

    );

}

export default ReviewHistoryPage;