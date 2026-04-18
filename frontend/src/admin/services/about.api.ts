import axios from "../../api/axios";

export const getAbout = () => axios.get("/about");
export const updateAbout = (data: any) => axios.put("/about", data);