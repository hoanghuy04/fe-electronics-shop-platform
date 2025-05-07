const API_DOMAIN = "http://localhost:3000/";

export const get = async (path) => {
  try {
    const response = await fetch(API_DOMAIN + path);
    if (!response.ok) throw new Error("Lỗi khi fetch dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

export const post = async (path, options) => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    if (!response.ok) throw new Error("Lỗi khi POST dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("POST error:", error);
    return null;
  }
};

export const del = async (path) => {
  try {
    const response = await fetch(API_DOMAIN + path, { method: "DELETE" });
    if (!response.ok) throw new Error("Lỗi khi DELETE dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("DELETE error:", error);
    return null;
  }
};

export const patch = async (path, options) => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    if (!response.ok) throw new Error("Lỗi khi PATCH dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("PATCH error:", error);
    return null;
  }
};

export const put = async (path, options) => {
  try {
    const response = await fetch(API_DOMAIN + path, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    if (!response.ok) throw new Error("Lỗi khi PUT dữ liệu");
    return await response.json();
  } catch (error) {
    console.error("PUT error:", error);
    return null;
  }
}

