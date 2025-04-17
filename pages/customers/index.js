import Head from "next/head";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { getCustomers } from "../../lib/customers";
import LogoutButton from "../../components/LogoutButton";
import BackButton from "../../components/BackButton";
import { formatTransactionDate } from "../../lib/dateUtils";
import DashboardButton from "@/components/DashboardButton";
import { deleteCustomer } from "../../lib/customers";

export default function CustomerList() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    if (!currentUser) router.push("/");
    else fetchCustomers();
  }, [currentUser]);

  const fetchCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.phone.includes(searchTerm)
  );

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      // Refresh customer list
      fetchCustomers();
      setCustomerToDelete(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Manage Customers</title>
      </Head>

      {customerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(customerToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Back & Logout */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Manage Customers</h1>
            </div>
            <div>
              <BackButton />
              <DashboardButton />
              <LogoutButton />
            </div>
          </div>

          {/* Search & Add New Button */}
          <div className="flex justify-between mb-6">
            <input
              type="text"
              placeholder="Search by phone..."
              className="p-2 border rounded w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => router.push("/customers/add")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              + Add New Customer
            </button>
          </div>

          {/* Customer Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-500/20">
                <tr>
                  <th className="px-6 py-3 text-left">S.No</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Due (Tk.)</th>
                  <th className="px-6 py-3 text-left">Last Transaction</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{customer.name}</td>
                    <td className="px-6 py-4">{customer.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          customer.currentDue > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {customer.currentDue || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.lastTransaction ? (
                        <div>
                          <div className="capitalize">
                            {customer.lastTransaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTransactionDate(
                              customer.lastTransaction.date
                            )}
                          </div>
                        </div>
                      ) : (
                        "Never"
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => router.push(`/customers/${customer.id}`)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/customers/${customer.id}/deposit`)
                        }
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                      >
                        Update Due
                      </button>
                      <button
                        onClick={() => setCustomerToDelete(customer.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
