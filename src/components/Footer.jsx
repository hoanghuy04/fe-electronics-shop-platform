import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookOutlined, MessageOutlined, TikTokOutlined } from '@ant-design/icons';
import ghn from '../assets/gvn.png'
import ems from '../assets/ems.png'
import gvn from '../assets/gvn.png'
import other from '../assets/other.png'
import pay1 from '../assets/pay1.png'
import pay2 from '../assets/pay2.png'
import pay3 from '../assets/pay3.png'
import pay4 from '../assets/pay4.png'
import pay5 from '../assets/pay5.png'
import pay6 from '../assets/pay6.png'
import pay7 from '../assets/pay7.png'
import pay8 from '../assets/pay8.png'
import fb from '../assets/fb.png'
import zalo from '../assets/zalo.png'
import ytb from '../assets/ytb.png'
import tiktok from '../assets/tiktok.png'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 z-21">
      <div className="container text-lg mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Thông tin cơ bản */}
        <div>
          <h3 className="text-xl font-semibold mb-4">THÔNG TIN CÔNG TY</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">Công ty:</span> Công ty TNHH Thương Mại XYZ
            </li>
            <li>
              <span className="font-medium">Địa chỉ:</span> 123 Đường Láng, Đống Đa, Hà Nội
            </li>
            <li>
              <span className="font-medium">Email:</span>{' '}
              <a href="mailto:support@xyz.com" className="font-bold text-blue-500 hover:text-blue-400 transition-colors duration-200">
                support@xyz.com
              </a>
            </li>
            <li>
              <span className="font-medium">Số điện thoại:</span>{' '}
              <a
                href="tel:19005301"
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                1900.5642
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">TỔNG ĐÀI HỖ TRỢ (8:00 - 21:00)</h3>
          <ul className="space-y-2 text-lg">
            <li>
              Mua hàng:{' '}
              <a
                href="tel:19005301"
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                1900.5912
              </a>
            </li>
            <li>
              Bảo hành:{' '}
              <a
                href="tel:19005301"
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                1900.6753
              </a>
            </li>
            <li>
              Khiếu nại:{' '}
              <a
                href="tel:19005301"
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                1900.8198
              </a>
            </li>
          </ul>
        </div>

        {/* Đơn vị vận chuyển */}
        <div>
          <h3 className="text-xl font-semibold mb-4">ĐƠN VỊ VẬN CHUYỂN</h3>
          <div className="grid grid-cols-3 gap-1">
            <div className="img">
              <img src={ems} alt="" />
            </div>

            <div className="img">
              <img src={ghn} alt="" />
            </div>

            <div className=""></div>

            <div className="img">
              <img src={gvn} alt="" />
            </div>

            <div className="img">
              <img src={other} alt="" />
            </div>
          </div>
        </div>


        {/* Cách thức thanh toán */}
        <div>
          <h3 className="text-xl font-semi3bold mb-4">PHƯƠNG THỨC THANH TOÁN</h3>
          <div className="grid grid-cols-3 gap-1">
            {/* <div className="img">
              <img src={pay1} alt="" />
            </div>

            <div className="img">
              <img src={pay2} alt="" />
            </div> */}

            <div className="img">
              <img src={pay3} alt="" />
            </div>

            <div className="img">
              <img src={pay4} alt="" />
            </div>

            <div className="img">
              <img src={pay5} alt="" />
            </div>

            <div className="img">
              <img src={pay6} alt="" />
            </div>

            <div className="img">
              <img src={pay7} alt="" />
            </div>

            <div className="img">
              <img src={pay8} alt="" />
            </div>
          </div>
        </div>


      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center flex flex-col justify-center items-center gap-10">
        {/* Kết nối với chúng tôi */}
        <div>
          <h3 className="text-xl font-semibold mb-4 uppercase">Kết nối với chúng tôi</h3>
          <div className="grid grid-cols-4 gap-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <img src={fb} alt="" className='w-[48px] h-[48px]' />
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <img src={zalo} alt="" className='w-[48px] h-[48px]' />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <img src={tiktok} alt="" className='w-[48px] h-[48px]' />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors"
            >
              <img src={ytb} alt="" className='w-[48px] h-[48px]' />
            </a>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} Công ty TNHH Thương Mại XYZ. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;