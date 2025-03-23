import React, { useState } from "react";
import "./App.css"

interface Entry {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
}

const App: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [type, setType] = useState<"income" | "expense">("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [hasOtherIncome, setHasOtherIncome] = useState(false);

  const addEntry = () => {
    if (!description || !amount) {
      alert("概要と金額を入力してください");
      return;
    }

    const newEntry: Entry = {
      id: Date.now(),
      type,
      description,
      amount: Number(amount),
    };

    setEntries([...entries, newEntry]);
    setDescription("");
    setAmount("");
  };

  const calculateTotal = (type: "income" | "expense") => {
    return entries
      .filter((entry) => entry.type === type)
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const calculateTaxableIncome = () => {
    const totalIncome = calculateTotal("income");
    const totalExpense = calculateTotal("expense");

    let taxableIncome = totalIncome - totalExpense;

    if (!hasOtherIncome) {
      taxableIncome -= 480000; // 基礎控除 48万円
    }

    return taxableIncome > 0 ? taxableIncome : 0; // 課税所得が負なら0に
  };

  const calculateTax = (income: number) => {
    if (income <= 200000) return 0;

    if (income <= 1950000) return income * 0.05;
    if (income <= 3300000) return 1950000 * 0.05 + (income - 1950000) * 0.1;
    if (income <= 6950000)
      return (
        1950000 * 0.05 + 1350000 * 0.1 + (income - 3300000) * 0.2
      );
    if (income <= 9000000)
      return (
        1950000 * 0.05 + 1350000 * 0.1 + 3650000 * 0.2 + (income - 6950000) * 0.23
      );
    if (income <= 18000000)
      return (
        1950000 * 0.05 +
        1350000 * 0.1 +
        3650000 * 0.2 +
        2050000 * 0.23 +
        (income - 9000000) * 0.33
      );
    return (
      1950000 * 0.05 +
      1350000 * 0.1 +
      3650000 * 0.2 +
      2050000 * 0.23 +
      9000000 * 0.33 +
      (income - 18000000) * 0.4
    );
  };

  const taxableIncome = calculateTaxableIncome();
  const tax = calculateTax(taxableIncome);

  return (
    <div className="App">
      <h1>収入・支出管理</h1>

      <div className="form">
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">収入</option>
          <option value="expense">支出</option>
        </select>

        <input
          className="form-input"
          type="text"
          placeholder="概要"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="form-input"
          type="number"
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="form-button" onClick={addEntry}>追加</button>
      </div>

      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            checked={hasOtherIncome}
            onChange={(e) => setHasOtherIncome(e.target.checked)}
          />
          他の収入（給与など）がある
        </label>
      </div>

      <div className="list">
        <h2>項目一覧</h2>
        {entries.map((entry) => (
          <div key={entry.id} className={`entry ${entry.type}`}>
            <span>{entry.type === "income" ? "収入" : "支出"}</span>
            <span>{entry.description}</span>
            <span>{entry.amount.toLocaleString()} 円</span>
          </div>
        ))}
      </div>

      <div className="totals">
        <h2>計算結果</h2>
        <p>収入合計: {calculateTotal("income").toLocaleString()} 円</p>
        <p>支出合計: {calculateTotal("expense").toLocaleString()} 円</p>
        <p>課税所得: {taxableIncome.toLocaleString()} 円</p>
        <p>所得税: {tax.toLocaleString()} 円</p>
      </div>
    </div>
  );
};

export default App;
