// import React from "react";
// import { Link } from "react-router";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-center text-xl font-semibold mb-4" style={{ color: "var(--color-primary)" }}>
//           ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2"
//           style={{
//             borderColor: "var(--color-primary)",
//             '--tw-ring-color': 'var(--color-primary)',
//           }}
//         />

//         <input
//           type="password"
//           placeholder="Mật khẩu"
//           className="w-full border rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2"
//           style={{
//             borderColor: "var(--color-primary)",
//             '--tw-ring-color': 'var(--color-primary)',
//           }}
//         />

//         <div
//           className="text-right text-sm hover:underline cursor-pointer mb-4"
//           style={{ color: "var(--color-primary)" }}
//         >
//           Quên mật khẩu email?
//         </div>

//         <button
//           className="w-full !text-white py-2 rounded font-semibold mb-4 transition-colors duration-200"
//           style={{
//             backgroundColor: "var(--color-primary)",
//           }}
//         >
//           ĐĂNG NHẬP
//         </button>

//         <div className="text-center text-sm">
//           Bạn chưa có tài khoản?
//           <Link
//             to={{
//               pathname: "/register",
//               search: "?ref=login",
//               hash: "#form",
//             }}
//             className="font-medium ml-1 hover:underline"
//             style={{ color: "var(--color-primary)" }}
//           >
//             Đăng ký ngay!
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from "react";
import { Link } from "react-router";
import { get } from "../services/request"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const users = await get(`users?email=${email}&password=${password}`);
  
    if (users && users.length > 0) {
      alert("Đăng nhập thành công!");
    } else {
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-4" style={{ color: "var(--color-primary)" }}>
          ĐĂNG NHẬP HOẶC TẠO TÀI KHOẢN
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--color-primary)",
            '--tw-ring-color': 'var(--color-primary)',
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full border rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--color-primary)",
            '--tw-ring-color': 'var(--color-primary)',
          }}
        />

        <div
          className="text-right text-sm hover:underline cursor-pointer mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Quên mật khẩu email?
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded font-semibold mb-4 hover:brightness-90 transition-colors duration-200"
        >
          ĐĂNG NHẬP
        </button>

        <div className="text-center text-sm">
          Bạn chưa có tài khoản?
          <Link
            to={{ pathname: "/register", search: "?ref=login", hash: "#form" }}
            className="font-medium ml-1 hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Đăng ký ngay!
          </Link>
        </div>
      </div>
    </div>
  );
}
