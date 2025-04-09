// import React from "react";
// import { Link } from "react-router";

// export default function RegisterPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff5f5" }}>
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-center text-xl font-semibold mb-4" style={{ color: "var(--color-primary)" }}>
//           ĐĂNG KÝ TÀI KHOẢN GEARVN
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2"
//           style={{ '--tw-ring-color': 'var(--color-primary)' }}
//         />
//         <input
//           type="text"
//           placeholder="Họ"
//           className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2"
//           style={{ '--tw-ring-color': 'var(--color-primary)' }}
//         />
//         <input
//           type="text"
//           placeholder="Tên"
//           className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2"
//           style={{ '--tw-ring-color': 'var(--color-primary)' }}
//         />
//         <input
//           type="password"
//           placeholder="Mật khẩu"
//           className="w-full border border-gray-300 rounded px-4 py-2 mb-5 focus:outline-none focus:ring-2"
//           style={{ '--tw-ring-color': 'var(--color-primary)' }}
//         />

//         <button
//           className="w-full !text-white py-2 rounded font-semibold mb-4 transition"
//           style={{
//             backgroundColor: "var(--color-primary)",
//             '--tw-bg-opacity': 1,
//           }}
//         >
//           TẠO TÀI KHOẢN
//         </button>

//         <div className="text-center text-sm">
//           Bạn đã có tài khoản?
//           <Link
//             to={{
//               pathname: "/login",
//               search: "?from=register",
//               hash: "#form",
//             }}
//             className="font-medium ml-1 hover:underline"
//             style={{ color: "var(--color-primary)" }}
//           >
//             Đăng nhập!
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { Link } from "react-router";
import { post } from "../services/request"; 
export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await post("users", {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
    });

    if (response) {
      alert("Tạo tài khoản thành công!");
      
    } else {
      alert("Tạo tài khoản thất bại!");
      console.log("Gửi tới:", `${BASE_URL}/${url}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff5f5" }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-4" style={{ color: "var(--color-primary)" }}>
          ĐĂNG KÝ TÀI KHOẢN GEARVN
        </h2>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Họ"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Tên"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-5 focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded font-semibold mb-4 hover:brightness-90 transition"
        >
          TẠO TÀI KHOẢN
        </button>

        <div className="text-center text-sm">
          Bạn đã có tài khoản?
          <Link
            to={{ pathname: "/login", search: "?from=register", hash: "#form" }}
            className="font-medium ml-1 hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Đăng nhập!
          </Link>
        </div>
      </div>
    </div>
  );
}

