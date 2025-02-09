import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../context/FirebaseConfig";

function IncomeList({ projectId }) {
  const [incomeList, setIncomeList] = useState([]);

  useEffect(() => {
    if (!projectId) return;

    // 🔥 Real-time listener for income collection
    const incomeRef = collection(db, `projects/${projectId}/income`);
    const unsubscribe = onSnapshot(incomeRef, (snapshot) => {
      const incomeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncomeList(incomeData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [projectId]);

  return (
    <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-white mb-4">Incoming Money</h3>
      {incomeList.length === 0 ? (
        <p className="text-gray-400">No income records found.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {incomeList.map((income) => (
            <li key={income.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{income.description}</p>
                <p className="text-gray-400 text-sm">{income.date}</p>
              </div>
              <span className="text-green-400 font-semibold">₹{income.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IncomeList;
