import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../context/FirebaseConfig";

function IncomeList({ projectId }) {
  const [incomeList, setIncomeList] = useState([]);
  const [contractualTotal, setContractualTotal] = useState(0);
  const [nonContractualTotal, setNonContractualTotal] = useState(0);

  useEffect(() => {
    if (!projectId) return;

    const incomeRef = collection(db, `projects/${projectId}/income`);
    const unsubscribe = onSnapshot(incomeRef, (snapshot) => {
      let incomeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      incomeData = incomeData.sort((a, b) => new Date(b.date) - new Date(a.date));

      setIncomeList(incomeData);

      const contractualSum = incomeData
        .filter((income) => income.incomeType === "contractual")
        .reduce((sum, income) => sum + (income.amount || 0), 0);

      const nonContractualSum = incomeData
        .filter((income) => income.incomeType === "non-contractual")
        .reduce((sum, income) => sum + (income.amount || 0), 0);

      setContractualTotal(contractualSum);
      setNonContractualTotal(nonContractualSum);
    });

    return () => unsubscribe();
  }, [projectId]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-white mb-4">Incoming Money</h3>

      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-white font-medium">
          Contractual Income: <span className="text-green-400">₹{contractualTotal.toFixed(2)}</span>
        </p>
        <p className="text-white font-medium">
          Non-Contractual Income: <span className="text-blue-400">₹{nonContractualTotal.toFixed(2)}</span>
        </p>
      </div>

      {incomeList.length === 0 ? (
        <p className="text-gray-400">No income records found.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {incomeList.map((income) => (
            <li key={income.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{income.description}</p>
                <p className="text-gray-400 text-sm">{formatDate(income.date)}</p>
              </div>
              <span className={`font-semibold ${income.incomeType === "contractual" ? "text-green-400" : "text-blue-400"}`}>
                ₹{income.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IncomeList;
