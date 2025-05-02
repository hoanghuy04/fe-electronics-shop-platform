// import React, { useState } from "react";

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     setShowSuccess(true);

//     setFormData({ name: "", email: "", message: "" });

//     setTimeout(() => {
//       setShowSuccess(false);
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">

//       {showSuccess && (
//         <div className="fixed top-20 right-5 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50">
//           🎉 Gửi liên hệ thành công!
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
//         <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
//           Liên hệ với E-SHOP
//         </h1>

//         <div className="grid md:grid-cols-2 gap-10">
//           {/* Thông tin liên hệ */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
//             <p className="mb-2">
//               <strong>Địa chỉ:</strong> 730 Lê Hồng Phong, P.12, Q.10, TP. HCM
//             </p>
//             <p className="mb-2">
//               <strong>Hotline bán hàng:</strong>{" "}
//               <a href="tel:18006979" className="text-blue-600 hover:underline">
//                 1800 6979
//               </a>{" "}
//               (Miễn phí)
//             </p>
//             <p className="mb-2">
//               <strong>Email:</strong>{" "}
//               <a
//                 href="mailto:sales@eshopvn.com"
//                 className="text-blue-600 hover:underline"
//               >
//                 sales@eshopvn.com
//               </a>
//             </p>
//             <p className="mb-2">
//               <strong>Giờ làm việc:</strong> 8h00 - 21h30 (Tất cả các ngày)
//             </p>
//           </div>

//           {/* Form liên hệ */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Gửi tin nhắn</h2>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Họ và tên"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//                 required
//               />
//               <textarea
//                 name="message"
//                 rows="5"
//                 placeholder="Nội dung"
//                 value={formData.message}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//                 required
//               ></textarea>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
//               >
//                 Gửi liên hệ
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Bản đồ */}
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold mb-4 text-center">Bản đồ</h2>
//           <iframe
//             title="GearVN Map"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.417085882035!2d106.6774387759027!3d10.77706305920995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee4c47efb11%3A0x3f95a45f231814eb!2sGEARVN!5e0!3m2!1sen!2s!4v1614868700000!5m2!1sen!2s"
//             width="100%"
//             height="400"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             className="rounded"
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowSuccess(true);
    setFormData({ name: "", email: "", message: "" });

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {showSuccess && (
        <div className="fixed top-20 right-5 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50">
          🎉 Gửi liên hệ thành công!
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Liên hệ với E-SHOP
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Thông tin liên hệ */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
            <p className="mb-2">
              <strong>Địa chỉ:</strong> 730 Lê Hồng Phong, P.12, Q.10, TP. HCM
            </p>
            <p className="mb-2">
              <strong>Hotline bán hàng:</strong>{" "}
              <a
                href="tel:18006979"
                className="text-[var(--color-primary)] hover:underline"
              >
                1800 6979
              </a>{" "}
              (Miễn phí)
            </p>
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:sales@eshopvn.com"
                className="text-[var(--color-primary)] hover:underline"
              >
                sales@eshopvn.com
              </a>
            </p>
            <p className="mb-2">
              <strong>Giờ làm việc:</strong> 8h00 - 21h30 (Tất cả các ngày)
            </p>
          </div>

          {/* Form liên hệ */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Gửi tin nhắn</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                required
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Nội dung"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-[var(--color-primary)] !text-white py-2 px-6 rounded transition"
              >
                Gửi liên hệ
              </button>
            </form>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-center">Bản đồ</h2>
          <iframe
            title="GearVN Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.417085882035!2d106.6774387759027!3d10.77706305920995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee4c47efb11%3A0x3f95a45f231814eb!2sGEARVN!5e0!3m2!1sen!2s!4v1614868700000!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
