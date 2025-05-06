import { get, post, patch } from "./request";

export const reviewService = {

  addReview: async (reviewData) => {

    try {
      const result = await post('reviews', reviewData);
      if (result) {
        console.log("Review đã được thêm thành công:", result);
        return result; // Trả về dữ liệu phản hồi từ server (nếu cần)
      }
    } catch (error) {
      console.error("Lỗi khi thêm review:", error);
      return null;
    }
  },

  getReviewsByProductID: async (productID) => {
    try {
      const reviews = await get(`reviews?product_id=${productID}`);

      if (!reviews || !Array.isArray(reviews)) {
        throw new Error("Dữ liệu reviews không hợp lệ");
      }

      return reviews;
    } catch (error) {
      console.error(error);
    }
  },

  addReplyToReview: async (reviewId, replyData) => {
    try {
      const updatedReview = await patch(`reviews/${reviewId}`, {
        replies: [...replyData],
      });
      return updatedReview;
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
      throw error;
    }
  },
}