// pages/customers/add.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { addCustomer } from "@/lib/customers";
import LogoutButton from "../../components/LogoutButton";
import BackButton from "../../components/BackButton";
import Head from "next/head";
import DashboardButton from "@/components/DashboardButton";

export default function AddCustomer() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentDue: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCustomer(formData);
    router.push("/customers");
  };

  if (!currentUser) return null;

  return (
    <>
      <Head>
        <title>Add Customer</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          {/* Header with Back & Logout */}
          <div className="flex justify-between items-center mb-6">
            <BackButton />
            <DashboardButton />
            <LogoutButton />
          </div>
          <h1 className="text-xl font-bold mb-4">Add New Customer</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Phone</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Save Customer
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
