import { Steps } from "antd";
import { IdCard, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StepCart(props) {
  const { current, setCurrent } = props;
  const navigate = useNavigate();
  const items = [
    {
      title: "Giỏ hàng",
      icon: <ShoppingBag />,
    },
    {
      title: "T.Tin đặt hàng",
      icon: <IdCard />,
    },
    {
      title: "Thanh toán",
      icon: <CreditCard />,
    },
    {
      title: "Hoàn tất",
      icon: <ShieldCheck />,
    },
  ];

  const onChange = (value) => {
    setCurrent(value);
    console.log("value", value);
    if (value === 0) {
      navigate("/cart");
    } else if (value === 1) {
      navigate("/cart/step-two");
    } else if (value === 2) {
      navigate("/cart/step-three");
    }
  };

  const stepsDisabled = (index) => index > current;

  return (
    <div className="bg-white p-3">
      <div className="py-3 px-5 rounded-sm bg-blue-50">
        <Steps current={current} onChange={onChange} labelPlacement="vertical">
          {items.map((item, index) => (
            <Steps.Step
              key={index}
              title={item.title}
              icon={item.icon}
              disabled={stepsDisabled(index)}
            />
          ))}
        </Steps>
      </div>
    </div>
  );
}
