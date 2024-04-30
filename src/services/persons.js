import axios from "axios";
const baseUrl = "/api/persons";

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newPerson) => {
  const request = await axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};

const update = async (id, newPerson) => {
  const request = await axios.put(`${baseUrl}/${id}`, newPerson);
  return request.then((response) => response.data);
};

const deletePerson = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, update, deletePerson };
