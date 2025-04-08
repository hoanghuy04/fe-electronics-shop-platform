import { getAllProvinces, getDistricts, getWards } from "../services/address";

export const fetchProvinces = async () => {
  const provinceData = await getAllProvinces();
  return provinceData.data;
};

export const fetchDistrictsByProvince = async (e) => {
  const districtData = await getDistricts(e.split("-")[0]);
  return districtData.data;
};

export const fetchWardsByDistrict = async (e) => {
  const wardData = await getWards(e.split("-")[0]);
  return wardData.data;
};
