"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PriceHistory = {
  date: string;
  price: number;
};

export default function PriceHistoryPage() {
  const { id } = useParams(); // id машины из URL
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetch(`https://backend.perekup-pro.com.ua/api/cars/prices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId: Number(id) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPriceHistory(
          data.map((item: PriceHistory) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("uk-UA"),
          }))
        );
      })
      .catch((err) => {
        console.error("Ошибка загрузки истории цен:", err);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">История изменения цены</h1>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : priceHistory.length === 0 ? (
        <p>История цен отсутствует.</p>
      ) : (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin", "dataMax"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation"; // ❗️ для App Router
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// type PriceHistory = {
//   date: string;
//   price: number;
// };

// export default function PriceHistoryPage() {
//   const { id } = useParams(); // id машины из URL
//   const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

//   // Для теста пока захардкодим данные
//   useEffect(() => {
//     setPriceHistory([
//       { date: "01.08.2023", price: 10000 },
//       { date: "15.08.2023", price: 9500 },
//       { date: "01.09.2023", price: 9200 },
//       { date: "15.09.2023", price: 8800 },
//       { date: "01.10.2023", price: 9000 },
//     ]);
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">История изменения цены</h1>
//       <div className="w-full h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={priceHistory}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="price"
//               stroke="#2563eb"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
