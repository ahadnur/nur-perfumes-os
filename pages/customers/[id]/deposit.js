import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { getCustomerById, updateCustomerDue } from "../../../lib/customers";
import LogoutButton from "../../../components/LogoutButton";
import BackButton from "../../../components/BackButton";
import Head from "next/head";
import DashboardButton from "@/components/DashboardButton";

export default function UpdateDuePage() {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("deposit");

  // Load customer data
  useEffect(() => {
    if (!currentUser) router.push("/");
    else if (id) loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    const data = await getCustomerById(id);
    setCustomer(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCustomerDue(id, amount, type);
    router.push("/customers");
  };

  if (!currentUser || !customer) return null;

  return (
    <>
    <Head>
        <title>Update Due</title>
    </Head>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        {/* Header with Back & Logout */}
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <DashboardButton />
          <LogoutButton />
        </div>
        <h1 className="text-xl font-bold mb-4">
          Update Due for {customer.name}
        </h1>
        <p className="mb-4">Current Due: ৳ {customer.currentDue || 0}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Transaction Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="deposit">Deposit (Increase Due)</option>
              <option value="payment">Payment (Decrease Due)</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
          >
            Update Due
          </button>
        </form>
      </div>
    </div>
    </>
  );
}