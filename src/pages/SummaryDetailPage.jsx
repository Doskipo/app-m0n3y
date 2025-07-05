import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllExpenses, getAllCategories } from "../firestoreHelpers";
import LoadingScreen from "../components/LoadingScreen";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f",
  "#ffbb28", "#0088fe", "#ff6666", "#a28fd0", "#b0e57c"
];

export default function SummaryDetailPage() {
  const { year, month } = useParams();
  const today = new Date();
  const navigate = useNavigate();

  const selectedYear = year ? parseInt(year) : today.getFullYear();
  const selectedMonth = month ? parseInt(month) - 1 : today.getMonth();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const exp = await getAllExpenses();
      const cats = await getAllCategories();
      setExpenses(exp);
      setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return (
      date.getFullYear() === selectedYear &&
      date.getMonth() === selectedMonth
    );
  });

  const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const totalPerCat = {};
  const totalPerSub = {};

  filteredExpenses.forEach((e) => {
    const cat = e.category;
    const sub = e.subcategory || "(Sense subcategoria)";
    const amt = parseFloat(e.amount || 0);

    totalPerCat[cat] = (totalPerCat[cat] || 0) + amt;
    const key = `${cat}|||${sub}`;
    totalPerSub[key] = (totalPerSub[key] || 0) + amt;
  });

  const pieData = Object.entries(totalPerCat).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="max-w-md mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
      >
        ← Enrere
      </button>

      <h1 className="text-2xl font-bold mb-2 text-center">📊 Resum de despeses</h1>
      <p className="text-center text-sm text-gray-500 mb-4">
        Resum de: <strong>{MONTHS[selectedMonth]} {selectedYear}</strong>
      </p>

      <div className="bg-blue-100 p-4 rounded mb-6 text-center">
        <p className="text-gray-700">Total gastat:</p>
        <p className="text-3xl font-extrabold text-blue-700">{total.toFixed(2)} €</p>
      </div>

      {pieData.length > 0 && (
        <div className="w-full h-64 mb-6">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value.toFixed(2)} €`, "Despesa"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-6">
        {categories.map((cat, i) => {
          const catTotal = totalPerCat[cat.name] || 0;
          const percentGlobal = total > 0 ? ((catTotal / total) * 100).toFixed(0) : "0";

          return (
            <div key={i} className="bg-white shadow p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg text-gray-800">{cat.name}</h2>
                <div className="text-right">
                  <p className="text-gray-700 font-semibold text-base">{catTotal.toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">{percentGlobal}%</p>
                </div>
              </div>

              <div className="space-y-1 ml-2 text-sm">
                {cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub, j) => {
                    const key = `${cat.name}|||${sub}`;
                    const subTotal = totalPerSub[key] || 0;
                    const percentLocal = catTotal > 0 ? ((subTotal / catTotal) * 100).toFixed(0) : "0";
                    return (
                      <div key={j} className="flex justify-between items-center text-gray-600">
                        <span className="truncate">• {sub}</span>
                        <div className="text-right">
                          <p className="tabular-nums leading-none">{subTotal.toFixed(2)} €</p>
                          <p className="text-xs text-gray-400 leading-none">{percentLocal}%</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="italic text-gray-400">– (Sense subcategories)</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
