import axiosClient from "./axiosClient";

const reviewApi = {
  getReviewsByProduct: (productId) =>
    axiosClient.get(`/reviews/product/${productId}`),

  createReview: (productId, data) =>
    axiosClient.post(`/reviews/product/${productId}`, data),
};

export default reviewApi;
