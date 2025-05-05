// src/pages/PaymentInstructions.jsx
import React from "react";
import PaymentOptionCard from "../../components/PaymentOptionCard";

export default function PaymentInstructions() {
  return (
    <div className="scroll-smooth bg-gradient-to-r from-red-600 to-red-400 min-h-screen text-white">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">
          Thông tin hướng dẫn Thanh toán
        </h1>
        <p className="mb-8 text-lg">
          Trang nội dung mang đến cho quý khách hàng thông tin hướng dẫn thanh
          toán khi mua hàng tại E-Shop
        </p>
        <button className="bg-yellow-300 text-black px-4 py-2 rounded-lg mb-10 font-semibold hover:bg-yellow-400">
          Tìm hiểu ngay
        </button>

        {/* Thẻ chọn phương thức */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-16 !text-black">
          <PaymentOptionCard
            title="Thanh toán chuyển khoản"
            description="Chuyển khoản qua tài khoản ngân hàng của E-Shop."
            icon="💳"
            link="#chuyen-khoan"
          />
          <PaymentOptionCard
            title="Thanh toán trực tiếp"
            description="Đến showroom E-Shop để thanh toán."
            icon="💵"
            link="#truc-tiep"
          />
          <PaymentOptionCard
            title="Thanh toán khi nhận hàng"
            description="Thanh toán cho nhân viên giao hàng hoặc đơn vị vận chuyển."
            icon="🤝"
            link="#nhan-hang"
          />
        </div>

        {/* Chi tiết chuyển khoản */}
        <div
          id="chuyen-khoan"
          className="bg-white text-while (condition) {
                    
                } p-6 rounded-xl shadow-md"
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Thanh toán chuyển khoản
          </h2>
          <p className="mb-2">
            Quý khách có thể thanh toán đơn hàng bằng cách chuyển khoản qua tài
            khoản dưới đây và liên hệ{" "}
            <a
              href="tel:19005301"
              className="font-medium underline"
              style={{ color: "var(--color-primary)" }}
            >
              Hotline 1900 5301
            </a>{" "}
            để xác nhận.
          </p>
          <div
            className="mt-4 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center"
            style={{ backgroundColor: "#fff5f5" }}
          >
            <div>
              <p>
                <strong>Ngân hàng:</strong> MB - Ngân hàng TMCP Quân đội
              </p>
              <p>
                <strong>Chủ tài khoản:</strong> Công ty TNHH Thương mại E-Shop
              </p>
              <p>
                <strong>Chi nhánh:</strong> Đông Sài Gòn - PGD: Quận 10
              </p>
              <p>
                <strong>Số tài khoản:</strong> 1111126868888
              </p>
            </div>
            <div className="flex justify-between items-center">
              <button
                className="w-64 text-white py-2 rounded font-semibold mb-4 transition !m-4"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Quét mã qr để thanh toán
              </button>
              <img
                src="/src/assets/qrcode.png"
                alt="QR thanh toán"
                className="w-32 h-32 mt-4 md:mt-0"
              />
            </div>
          </div>
        </div>

        {/* Thanh toán trực tiếp */}
        <div
          id="truc-tiep"
          className="bg-white text-black p-6 rounded-xl shadow-md mt-10"
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Thanh toán trực tiếp
          </h2>
          <p className="mb-2">
            Quý khách có thể đến trực tiếp các showroom của E-Shop để thanh toán
            và nhận hàng.
          </p>
          <p className="mb-4">
            Vui lòng gọi đến{" "}
            <a
              href="tel:19005301"
              className="font-medium underline"
              style={{ color: "var(--color-primary)" }}
            >
              Hotline 1900 5301
            </a>{" "}
            để được hướng dẫn chi tiết trước khi đến.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div
              className="p-3 rounded-lg flex-1 w-full md:w-3/5 space-y-4"
              style={{ backgroundColor: "#fff5f5" }}
            >
              <h3 className="font-semibold mb-2 text-lg">
                Địa chỉ Showroom E-Shop:
              </h3>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm font-medium mb-2">
                  🔹 78-80 Hoàng Hoa Thám, P.12, Q.Tân Bình, TP.HCM
                </p>
                <iframe
                  className="w-full h-32 rounded-md"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0565982228315!2d106.65167977490742!3d10.80502288934564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175291e725d1b0b%3A0x5b7554c6f9ea391d!2zNzggSMOgbmcgSG9hIFRow6FtLCBQLjEyLCBU4bqvbiBCw6xuaCwgVGjDoG5oIHBo4buRIEjDoCBO4buZaSwgVMOibiBCw6xuaCwgSOG7kyBDaMOtbmggTWluaCA3NTAwMDA!5e0!3m2!1svi!2s!4v1712650000000!5m2!1svi!2s"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm font-medium mb-2">
                  🔹 905 Kha Vạn Cân, Linh Tây, TP.Thủ Đức, TP.HCM
                </p>
                <iframe
                  className="w-full h-32 rounded-md"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.086315434045!2d106.75578907490741!3d10.80325188938783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dcb59e6d71bb%3A0x4c92de66f58a5d68!2zOTA1IEtoYSBW4bqvbiBDw6FuLCBMaW5oIFThur8sIFRow7RuZyB04buZdSwgVGjDoG5oIHBo4buRIEjDoCBO4buZaSwgVMOibiBCw6xuaCwgSOG7kyBDaMOtbmggTWluaCA3NTAwMDA!5e0!3m2!1svi!2s!4v1712650000000!5m2!1svi!2s"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <img
              src="/src/assets/employee.jpg"
              alt="Shipper giao hàng"
              className="w-100 h-auto object-contain"
            />
          </div>
        </div>

        {/* Thanh toán khi nhận hàng */}
        <div
          id="nhan-hang"
          className="bg-white text-black p-6 rounded-xl shadow-md mt-10"
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Thanh toán khi nhận hàng
          </h2>
          <p className="mb-4">
            Với phương thức này, quý khách sẽ thanh toán trực tiếp cho nhân viên
            giao hàng hoặc đơn vị vận chuyển khi nhận được sản phẩm tại địa chỉ
            đã đăng ký.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <ul className="list-disc list-inside text-sm mb-2 list-none">
                <li>
                  🔹 Áp dụng với các đơn hàng nội thành và một số khu vực ngoại
                  thành.
                </li>
                <li>
                  🔹 Quý khách nên chuẩn bị sẵn số tiền cần thanh toán khi nhận
                  hàng để tiết kiệm thời gian giao nhận.
                </li>
                <li>
                  🔹 Hỗ trợ kiểm tra sản phẩm trước khi thanh toán để đảm bảo
                  quyền lợi khách hàng.
                </li>
                <li>
                  🔹 Trường hợp đơn hàng có giá trị cao, E-Shop có thể liên hệ
                  xác nhận thêm thông tin người nhận.
                </li>
                <li>
                  🔹 Phí vận chuyển sẽ được tính theo khoảng cách và chính sách
                  giao hàng hiện hành.
                </li>
                <li>
                  🔹 Nếu quý khách không có mặt tại thời điểm giao hàng, đơn
                  hàng có thể bị chuyển hoàn.
                </li>
                <li>
                  🔹 Hình thức thanh toán này không áp dụng cho các đơn hàng đặt
                  trước hoặc cần cọc.
                </li>
              </ul>
              <p className="text-sm mt-2">
                Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ{" "}
                <a
                  href="tel:19005301"
                  className="font-medium underline"
                  style={{ color: "var(--color-primary)" }}
                >
                  Hotline 1900 5301
                </a>
                .
              </p>
            </div>
            <img
              src="/src/assets/shiper.jpg"
              alt="Shipper giao hàng"
              className="w-100 h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
