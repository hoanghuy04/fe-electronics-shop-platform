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

export const getProvinceById = async (id) => {
  try {
    const provinces = await getAllProvinces();

    if (!provinces || !provinces.data) {
      console.error("Không có dữ liệu tỉnh");
      return null;
    }

    const province = provinces.data.find((province) => province.id === id);
    if (!province) {
      console.error("Không tìm thấy tỉnh với ID:", id);
      return null;
    }

    return province;
  } catch (error) {
    console.error("Lỗi khi tìm tỉnh:", error);
    return null;
  }
};

export const getDistrictById = async (districtID, provinceID) => {
  try {
    const districts = await getDistricts(provinceID);
    if (!districts || !districts.data) {
      console.error("Không có dữ liệu quận");
      return null;
    }

    const district = districts.data.find(
      (district) => district.id === districtID
    );
    if (!district) {
      console.error("Không tìm thấy quận với ID:", districtID);
      return null;
    }

    return district;
  } catch (error) {
    console.error("Lỗi khi tìm quận:", error);
    return null;
  }
};

export const getWardById = async (wardID, districtID) => {
  try {
    const wards = await getWards(districtID);
    if (!wards || !wards.data) {
      console.error("Không có dữ liệu xã");
      return null;
    }

    const ward = wards.data.find((ward) => ward.id === wardID);
    if (!ward) {
      console.error("Không tìm thấy xã với ID:", wardID);
      return null;
    }

    return ward;
  } catch (error) {
    console.error("Lỗi khi tìm xã:", error);
    return null;
  }
};
