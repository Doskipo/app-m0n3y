import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllExpenses, getAllEarnings } from "../firestoreHelpers";
import LoadingScreen from "../components/LoadingScreen";

const MONTHS = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];

export default function RecapPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [expenses, setExpenses] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const exp = await getAllExpenses();
      const earn = await getAllEarnings();
      setExpenses(exp);
      setEarnings(earn);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  const getMonthData = (monthIdx) => {
    const filteredExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return date.getFullYear() === selectedYear && date.getMonth() === monthIdx;
    });

    const filteredEarnings = earnings.filter((e) => {
      const date = new Date(e.date);
      return date.getFullYear() === selectedYear && date.getMonth() === monthIdx;
    });

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalEarnings = filteredEarnings.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const balance = totalEarnings - totalExpenses;

    return {
      expenses: totalExpenses,
      earnings: totalEarnings,
      balance,
    };
  };

  const chartData = MONTHS.map((mes, idx) => {
    const { earnings, expenses, balance } = getMonthData(idx);
    return {
      mes,
      Guanys: parseFloat(earnings.toFixed(2)),
      Despeses: parseFloat(expenses.toFixed(2)),
      Balanç: parseFloat(balance.toFixed(2)),
    };
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/"
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
        >
          ← Inici
        </Link>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">📆 Resum Anual {selectedYear}</h1>

      <table className="w-full text-sm text-left border border-gray-300">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="p-2">Mes</th>
            <th className="p-2">Guanys</th>
            <th className="p-2">Despeses</th>
            <th className="p-2">Balanç (€)</th>
            <th className="p-2">Deeply</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((mes, idx) => {
            const { earnings, expenses, balance } = getMonthData(idx);
            const balanceClass = balance < 0 ? "text-red-600" : "text-black font-semibold";

            return (
              <tr key={idx} className="even:bg-green-50">
                <td className="p-2 font-semibold">{mes}</td>
                <td className="p-2">{earnings.toFixed(2)} €</td>
                <td className="p-2">{expenses.toFixed(2)} €</td>
                <td className={`p-2 ${balanceClass}`}>{balance.toFixed(2)} €</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => navigate(`/recap/resum/${selectedYear}/${idx + 1}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    ➜
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-10 mb-4 text-center">📈 Evolució anual</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Guanys" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="Despeses" stroke="#dc2626" strokeWidth={2} />
            <Line type="monotone" dataKey="Balanç" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
