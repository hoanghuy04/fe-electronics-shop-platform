const API_PROVINCE = "https://esgoo.net/api-tinhthanh/1/0.htm";
const API_DISTRICT = "https://esgoo.net/api-tinhthanh/2/";
const API_WARD = "https://esgoo.net/api-tinhthanh/3/";

export const getAllProvinces = async () => {
  try {
    const response = await fetch(API_PROVINCE);
    if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

export const getDistricts = async (path) => {
  try {
    const response = await fetch(API_DISTRICT + `${path}.htm`);
    if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

export const getWards = async (path) => {
  try {
    const response = await fetch(API_WARD + `${path}.htm`);
    if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};
