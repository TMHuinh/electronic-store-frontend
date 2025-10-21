import axiosClient from "./axiosClient";

const getOrders = () => axiosClient.get("/orders");
const getOrderById = (id) => axiosClient.get(`/orders/${id}`);
const createOrder = (data) => axiosClient.post("/orders", data);
const getMyOrders= () => axiosClient.get('/orders/myorders');

export default { getOrders, getOrderById, createOrder,getMyOrders };
