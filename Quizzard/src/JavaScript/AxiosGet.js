import axios from "axios";


export default async function ApiGet(query) {
  let sqlData = {};
  await axios
    .get("http://"+import.meta.env.VITE_SERVER_IP+":"+import.meta.env.VITE_SERVER_PORT+"/sql?format=json", { params: { sqlQuery: query } })
    .then((response) => {
      console.log("answer from server:", response.data);
      sqlData = response.data;
    })
    .catch((error) => {
      console.log("error recieved");
      console.error("Error with the GET request:", error);
    });
  return sqlData;
}

