import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../context/FirebaseConfig";
import { doc, getDoc, collection, addDoc, onSnapshot, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import ExpenseList from "../components/expenseList.jsx";
import ExpenseForm from "../components/expenseForm.jsx";
import PersonList from "../components/personList.jsx";
import PersonForm from "../components/personForm.jsx";
import IncomeList from "../components/incomeList.jsx";

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(""); // Track selected person

  useEffect(() => {
    const fetchProject = async () => {
      const docSnap = await getDoc(doc(db, "projects", projectId));
      if (docSnap.exists()) setProject({ id: projectId, ...docSnap.data() });
    };

    const unsubscribeExpenses = onSnapshot(
      collection(db, `projects/${projectId}/expenses`),
      (snapshot) => {
        setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    const unsubscribePeople = onSnapshot(
      collection(db, `projects/${projectId}/people`),
      (snapshot) => {
        setPeople(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    fetchProject();
    return () => {
      unsubscribeExpenses();
      unsubscribePeople();
    };
  }, [projectId]);

  const addPerson = async (name) => {
    const personId = name.toLowerCase(); // 🔹 Convert name to lowercase for the document ID
    const personRef = doc(db, `projects/${projectId}/people`, personId); 
    const personSnap = await getDoc(personRef);
  
    if (!personSnap.exists()) {
      await setDoc(personRef, { name, totalExpense: 0 }); // 🔹 Ensure totalExpense is initialized
    }
  };

  const addExpense = async (personId, amount, description, expenseType, date) => {
    const amountNum = parseFloat(amount);
    const expenseData = {
        person: personId,
        amount: amountNum,
        description,
        expenseType,
        date, // 🔹 Save the date
        timestamp: new Date(), // Keep original timestamp
    };
  
    if (expenseType === "person") {
      if (!personId) return alert("Please select a person!");
  
      // Ensure personId is lowercase
      const personRef = doc(db, `projects/${projectId}/people`, personId.toLowerCase());
      const personSnap = await getDoc(personRef);
  
      if (!personSnap.exists()) {
        await setDoc(personRef, { name: personId, totalExpense: amountNum });
      } else {
        const currentPersonExpense = personSnap.data().totalExpense || 0;
        await updateDoc(personRef, { totalExpense: currentPersonExpense + amountNum });
      }
  
      expenseData.person = personId;
    } else {
      expenseData.person = "company"; // Mark as company expense
    }
  
    // 🔹 Add Expense Entry
    await addDoc(collection(db, `projects/${projectId}/expenses`), expenseData);
  
    // 🔹 Update Total Expense of Project
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
    const currentTotalExpense = projectSnap.exists() ? projectSnap.data().totalExpense || 0 : 0;
    setProject({...project, totalExpense: currentTotalExpense + amountNum });
  
    await updateDoc(projectRef, {
      totalExpense: currentTotalExpense + amountNum,
    });
  };  

  const addIncome = async (amount, description, date, incomeType) => {
    const incomeData = {
      amount: parseFloat(amount),
      description,
      incomeType,
      date, // 🔹 Store the date
      timestamp: new Date(), // Keep original timestamp
    };
  
    await addDoc(collection(db, `projects/${projectId}/income`), incomeData);
  };
  const updateExpense = async (id, updatedData) => {
    try {
      const expenseRef = doc(db, `projects/${projectId}/expenses`, id);
      const oldExpense = expenses.find((expense) => expense.id === id);
      if (!oldExpense) {
        console.error("Expense not found.");
        return;
      }
  
      // 🔹 Calculate the difference in amount (handle if amount is changed)
      const newAmount = updatedData.amount !== undefined ? parseFloat(updatedData.amount) : oldExpense.amount;
      const amountDifference = newAmount - oldExpense.amount;
  
      // 🔥 Update Firestore - Update totalExpense in project if amount changes
      if (amountDifference !== 0) {
        await updateDoc(doc(db, "projects", projectId), {
          totalExpense: project.totalExpense + amountDifference,
        });
      }
  
      // 🔹 Update Firestore with new data
      await updateDoc(expenseRef, {
        person: updatedData.person || oldExpense.person,
        description: updatedData.description || oldExpense.description,
        amount: newAmount,
        date: updatedData.date || oldExpense.date,
      });
  
      // 🔹 Update local state with updated values
      setExpenses(expenses.map(expense =>
        expense.id === id ? { ...expense, ...updatedData, amount: newAmount } : expense
      ));
  
      // 🔥 If amount changed, update the project state
      if (amountDifference !== 0) {
        setProject({ ...project, totalExpense: project.totalExpense + amountDifference });
      }
  
      console.log("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };
  
  
  
  
  if (!project) return <p className="text-white text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen bg-gray-900 text-white p-6 overflow-y-scroll">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-4">{project.name}</h2>
        <p className="text-lg text-center text-gray-400 mb-6">Total Expense: <span className="text-green-400 font-semibold">₹{project.totalExpense}</span></p>

        {/* 🔹 Dropdown to Select a Person */}
        <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Person:</label>
        <select
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
        >
            <option value="">-- Select a Person --</option>
            {people.map((person) => (
            <option key={person.id} value={person.id}>
                {person.name} - ₹{person.totalExpense}
            </option>
            ))}
        </select>
        </div>

        {/* 🔹 Show Selected Person's Total Expense */}
        {selectedPerson && (
        <div className="bg-gray-800 p-5 rounded-lg shadow-md mb-4 text-center">
            <h2 className="text-2xl font-bold text-white">
            💰 {people.find((p) => p.id === selectedPerson)?.name}'s Total Expense:
            </h2>
            <p className="text-3xl font-semibold text-green-400">
            ₹{people.find((p) => p.id === selectedPerson)?.totalExpense || 0}
            </p>
        </div>
        )}

        {/* 🔹 Show List of Transactions */}
        {selectedPerson && (
        <div className="bg-gray-800 p-5 rounded-lg shadow-md mt-4">
            <h3 className="text-xl font-bold text-white mb-3">📜 Transactions</h3>
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 p-2">
            <ul>
                {expenses
                .filter((expense) => expense.person === selectedPerson)
                .map((expense) => (
                    <li
                    key={expense.id}
                    className="p-3 border-b border-gray-600 bg-gray-700 rounded-lg shadow-md mb-2"
                    >
                    <p className="text-lg font-semibold text-white">
                        💸 ₹{expense.amount}
                    </p>
                    <p className="text-gray-400 text-md">📌 {expense.description}</p>
                    <p className="text-gray-500 text-sm">📅 {expense.date}</p>
                    </li>
                ))}
            </ul>
            </div>
        </div>
        )}


        {/* 🔹 Forms & Lists */}
        <div className="grid md:grid-cols-2 gap-6">
            {/* 🔹 Left Column: People (Form + List Combined) */}
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-white mb-3">👥 Add & Manage People</h3>
                <PersonForm addPerson={addPerson} />
                <div className="mt-4">
                <PersonList people={people} />
                </div>
            </div>

            {/* 🔹 Right Column: Expenses (Form + List Combined) */}
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-white mb-3">💸 Add & Manage Expenses</h3>
                <ExpenseForm people={people} addExpense={addExpense} addIncome={addIncome} />
            </div>
            </div>
            {/* 🔹 Separate Income Section */}
            <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-white mb-3">📥 Expense Money</h3>
            <ExpenseList expenses={expenses} updateExpense={updateExpense}/>
            </div>

            <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-white mb-3">📥 Incoming Money</h3>
            <IncomeList projectId={projectId} />
            </div>

      </div>
    </div>
  );
}

export default ProjectDetails;
