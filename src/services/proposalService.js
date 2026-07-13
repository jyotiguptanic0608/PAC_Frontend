import axios from "axios";

const API_URL = "http://localhost:8080/api/proposals";

export function saveProposal(formData){
    return axios.post(API_URL,formData);
}

export function getAllProposls(){
    return axios.get(API_URL);
}