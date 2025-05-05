export const generateId = (prefix) => {
  const date = new Date();

  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  const randomNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${prefix}${dateStr}${randomNumber}`;
};

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday);
import "dayjs/locale/vi";
dayjs.locale("vi");

export const formatVietnameseDate = (dateStr) => {
  const day = dayjs(dateStr);
  const weekdayMap = {
    0: "Chủ Nhật",
    1: "Thứ Hai",
    2: "Thứ Ba",
    3: "Thứ Tư",
    4: "Thứ Năm",
    5: "Thứ Sáu",
    6: "Thứ Bảy",
  };
  return `${day.format("HH:mm")} ${weekdayMap[day.day()]}, ${day.format(
    "DD.MM.YYYY"
  )}`;
};
