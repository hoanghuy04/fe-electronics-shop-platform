import { useEffect, useState } from "react";
import { addressService } from "../services/address.service";

export default function AddressDisplay({ address }) {
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    const fetchAddressNames = async () => {
      if (address?.province) {
        const p = await addressService.getProvinceById(address.province);
        setProvinceName(p?.name || "");
      }
      if (address?.district) {
        const d = await addressService.getDistrictById(
          address.district,
          address.province
        );
        setDistrictName(d?.name || "");
      }
      if (address?.ward) {
        const w = await addressService.getWardById(
          address.ward,
          address.district
        );
        setWardName(w?.name || "");
      }
    };

    fetchAddressNames();
  }, [address]);

  return (
    <span>
      {address?.street}, {wardName}, {districtName}, {provinceName}
    </span>
  );
}
