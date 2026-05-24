import { useEffect, useMemo, useState } from "react";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  CircleDollarSign,
  Trash2,
  Pencil,
  Gift,
  Coins,
  ExternalLink,
} from "lucide-react";

const categories = [
  { name: "อาหาร", icon: <UtensilsCrossed className="w-5 h-5" /> },
  { name: "เดินทาง", icon: <Car className="w-5 h-5" /> },
  { name: "ช้อปปิ้ง", icon: <ShoppingBag className="w-5 h-5" /> },
  { name: "บิล", icon: <Receipt className="w-5 h-5" /> },
  { name: "บันเทิง", icon: <Gamepad2 className="w-5 h-5" /> },
  { name: "อื่นๆ", icon: <CircleDollarSign className="w-5 h-5" /> },
];

const trueDealProducts = [
  {
    type: "ทรูลดแรง",
    name: "ชาหมักคอมบูชะ",
    image: "https://placehold.co/160x160/orange/white?text=Drink",
    fullPrice: 35,
    salePrice: 25,
  },
  {
    type: "ทรูลดแรง",
    name: "แซนด์วิชอกไก่",
    image: "https://placehold.co/160x160/red/white?text=Food",
    fullPrice: 39,
    salePrice: 29,
  },
  {
    type: "แลก Coin",
    name: "น้ำดื่ม 600 มล.",
    image: "https://placehold.co/160x160/blue/white?text=Water",
    fullPrice: 10,
    salePrice: 1,
  },
  {
    type: "แลก Coin",
    name: "กาแฟพร้อมดื่ม",
    image: "https://placehold.co/160x160/yellow/white?text=Coffee",
    fullPrice: 25,
    salePrice: 15,
  },
];

export default function App() {
  const [budget, setBudget] = useState("");
  const [tempBudget, setTempBudget] = useState("");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("อาหาร");
  const [expenses, setExpenses] = useState([]);
  const [dealFilter, setDealFilter] = useState("ทรูลดแรง");
  const filteredDealProducts = trueDealProducts.filter(
    (product) => product.type === dealFilter
  );

  useEffect(() => {
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedBudget) setBudget(savedBudget);
    else setShowBudgetModal(true);

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const remaining = Number(budget || 0) - totalSpent;

  const percentage = budget
    ? Math.min((totalSpent / Number(budget)) * 100, 100)
    : 0;

  const dailyTarget = budget ? Math.round(Number(budget) / 30) : 0;

  const addExpense = () => {
    if (!amount || Number(amount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString("th-TH"),
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
  };

  const saveBudget = () => {
    if (!tempBudget || Number(tempBudget) <= 0) return;

    setBudget(tempBudget);
    localStorage.setItem("budget", tempBudget);
    setShowBudgetModal(false);
    setTempBudget("");
  };

  const handleReset = () => {
    const confirmReset = window.confirm("ต้องการล้างข้อมูลทั้งหมดใช่ไหม?");
    if (!confirmReset) return;

    localStorage.removeItem("budget");
    localStorage.removeItem("expenses");

    setBudget("");
    setExpenses([]);
    setTempBudget("");
    setShowBudgetModal(true);
  };

  const topCategory = useMemo(() => {
    const grouped = {};

    expenses.forEach((e) => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });

    let max = 0;
    let top = "-";

    Object.keys(grouped).forEach((key) => {
      if (grouped[key] > max) {
        max = grouped[key];
        top = key;
      }
    });

    return top;
  }, [expenses]);

  const getCategoryIcon = (cat) => {
    const found = categories.find((c) => c.name === cat);
    return found?.icon;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 pt-14 pb-10 rounded-b-[40px] shadow-lg">
        <h1 className="text-3xl font-bold text-white">Money Goal</h1>
        <p className="text-white/80 mt-2">วางแผนรายจ่ายรายเดือน</p>

        <div className="bg-white/20 backdrop-blur-lg mt-6 rounded-3xl p-5">
          <p className="text-white/70 text-sm">งบประมาณเดือนนี้</p>

          <div className="flex items-end justify-between mt-3 gap-4">
            <div>
              <p className="text-4xl font-bold text-white">
                ฿{Number(budget || 0).toLocaleString()}
              </p>

              <p className="mt-2 text-white">
                เป้าต่อวัน ≈ ฿{dailyTarget.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => {
                setTempBudget(budget);
                setShowBudgetModal(true);
              }}
              className="flex items-center gap-1 bg-white text-orange-500 px-4 py-2 rounded-xl font-bold"
            >
              <Pencil className="w-4 h-4" />
              แก้ไข
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5 space-y-5 pb-10">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">งบประมาณ</h2>
            <span className="font-bold text-orange-500">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-500">ใช้ไป</p>
              <p className="font-bold text-red-500 text-lg">
                ฿{totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500">คงเหลือ</p>
              <p className="font-bold text-green-600 text-lg">
                ฿{remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">ดีลช่วยประหยัด</h2>
              <p className="text-sm text-gray-500 mt-1">
                สินค้าราคาพิเศษสำหรับ TrueMoney และ Coin
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["ทรูลดแรง", "แลก Coin"].map((type) => (
              <button
                key={type}
                onClick={() => setDealFilter(type)}
                className={`h-11 rounded-2xl font-bold transition ${
                  dealFilter === type
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-orange-50 text-orange-600 border border-orange-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 snap-x">
            {filteredDealProducts.map((product) => (
              <div
                key={product.name}
                className="min-w-[150px] snap-start rounded-2xl border border-orange-100 bg-orange-50 p-3"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover rounded-xl bg-white"
                  />

                  <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-orange-600">
                    {product.type}
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold line-clamp-2">
                  {product.name}
                </p>

                <div className="mt-2">
                  <p className="text-xs text-gray-400 line-through">
                    ฿{product.fullPrice}
                  </p>

                  <p className="text-lg font-bold text-red-500">
                    ฿{product.salePrice}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://7eleven.onelink.me/37wq"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold"
          >
            ดูสินค้าในแอปเดลิเวอรี
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-lg">วิเคราะห์การใช้เงิน</h2>

          <div className="mt-4 space-y-3">
            <div className="bg-orange-50 p-4 rounded-2xl">
              <p className="text-sm text-gray-500">ใช้เยอะที่สุด</p>
              <p className="font-bold text-xl mt-1">{topCategory}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl">
              <p className="font-semibold">
                {percentage >= 80
                  ? "คุณใช้เงินใกล้ถึงลิมิตแล้ว ลองลดรายจ่ายที่ไม่จำเป็น"
                  : "ยังควบคุมงบได้ดีอยู่ 🎉"}
              </p>
            </div>

            <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
              ดูวิธีประหยัดเพิ่ม
            </button>
          </div>
        </div> */}

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-lg">เพิ่มรายจ่าย</h2>

          <input
            type="number"
            placeholder="จำนวนเงิน"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-4 w-full h-14 rounded-2xl border border-gray-200 px-4 text-lg outline-none"
          />

          <div className="grid grid-cols-3 gap-3 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${
                  category === cat.name
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white border-gray-200"
                }`}
              >
                {cat.icon}
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={addExpense}
            className="mt-5 w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold"
          >
            บันทึกค่าใช้จ่าย
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">รายการล่าสุด</h2>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-red-500 font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {expenses.length === 0 && (
              <p className="text-gray-400">ยังไม่มีรายการ</p>
            )}

            {expenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <p className="font-semibold">{item.category}</p>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                </div>

                <p className="font-bold text-red-500 text-lg">
                  - ฿{item.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-5 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold">ตั้งงบประมาณเดือนนี้</h2>

            <p className="text-gray-500 mt-2">
              ใส่งบที่อยากใช้ไม่เกินในเดือนนี้
            </p>

            <input
              type="number"
              placeholder="เช่น 9000"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="mt-5 w-full h-14 rounded-2xl border border-gray-300 px-4 text-2xl font-bold outline-none focus:border-orange-500"
              autoFocus
            />

            <button
              onClick={saveBudget}
              className="mt-5 w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold"
            >
              บันทึกงบประมาณ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}