const BASE_API = "https://esgoo.net/api-tinhthanh";
const API_PROVINCE = `${BASE_API}/1/0.htm`;
const API_DISTRICT = `${BASE_API}/2/`;
const API_WARD = `${BASE_API}/3/`;

export const addressService = {
  getAllProvinces: async () => {
    try {
      const response = await fetch(API_PROVINCE);
      if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu tỉnh");
      return await response.json();
    } catch (error) {
      console.error("GET error:", error);
      return null;
    }
  },

  getDistricts: async (provinceID) => {
    try {
      const response = await fetch(`${API_DISTRICT}${provinceID}.htm`);
      if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu quận/huyện");
      return await response.json();
    } catch (error) {
      console.error("GET error:", error);
      return null;
    }
  },

  getWards: async (districtID) => {
    try {
      const response = await fetch(`${API_WARD}${districtID}.htm`);
      if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu phường/xã");
      return await response.json();
    } catch (error) {
      console.error("GET error:", error);
      return null;
    }
  },

  getProvinceById: async (id) => {
    try {
      const provinces = await addressService.getAllProvinces();
      if (!provinces?.data) {
        console.error("Không có dữ liệu tỉnh");
        return null;
      }

      const province = provinces.data.find((p) => p.id === id);
      if (!province) {
        console.error("Không tìm thấy tỉnh với ID:", id);
        return null;
      }

      return province;
    } catch (error) {
      console.error("Lỗi khi tìm tỉnh:", error);
      return null;
    }
  },

  getDistrictById: async (districtID, provinceID) => {
    try {
      const districts = await addressService.getDistricts(provinceID);
      if (!districts?.data) {
        console.error("Không có dữ liệu quận");
        return null;
      }

      const district = districts.data.find((d) => d.id === districtID);
      if (!district) {
        console.error("Không tìm thấy quận với ID:", districtID);
        return null;
      }

      return district;
    } catch (error) {
      console.error("Lỗi khi tìm quận:", error);
      return null;
    }
  },

  getWardById: async (wardID, districtID) => {
    try {
      const wards = await addressService.getWards(districtID);
      if (!wards?.data) {
        console.error("Không có dữ liệu xã");
        return null;
      }

      const ward = wards.data.find((w) => w.id === wardID);
      if (!ward) {
        console.error("Không tìm thấy xã với ID:", wardID);
        return null;
      }

      return ward;
    } catch (error) {
      console.error("Lỗi khi tìm xã:", error);
      return null;
    }
  },
};
