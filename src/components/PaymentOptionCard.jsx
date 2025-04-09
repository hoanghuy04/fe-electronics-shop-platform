import React from "react";

export default function PaymentOptionCard({ title, description, icon, link }) {
  return (
    <a href={link} className="bg-white shadow-md rounded-xl p-4 w-full md:w-1/3 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
        <div >
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm my-2">{description}</p>
            
            <a href={link} className="text-blue-600 font-medium hover:underline">
                Xem chi tiết &gt;&gt;&gt;
            </a>
        </div>
    </a>



  );
}
