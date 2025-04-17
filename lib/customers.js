import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';

// Get all customers
export const getCustomers = async () => {
  const querySnapshot = await getDocs(collection(db, 'customers'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Calculate total dues
export const calculateTotalDues = (customers) => {
  return customers.reduce((total, customer) => total + (customer.currentDue || 0), 0);
};

// Get customer by ID
export const getCustomerById = async (id) => {
  const docRef = doc(db, "customers", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Customer not found!");
  return { id: docSnap.id, ...docSnap.data() };
};

// Add new customer
export const addCustomer = async (customerData) => {
  const docRef = await addDoc(collection(db, 'customers'), {
    ...customerData,
    currentDue: 0, // Start with 0 due
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...customerData };
};

// Update customer info (name, phone, etc.)
export const updateCustomerInfo = async (id, { name, phone }) => {
  const customerRef = doc(db, "customers", id);
  await updateDoc(customerRef, { name, phone });
};

// Update due (deposit or payment)
export const updateCustomerDue = async (id, amount, type = "deposit") => {
    const customerRef = doc(db, "customers", id);
    const customer = await getCustomerById(id);
    const currentDue = customer.currentDue || 0;
  
    const newDue = type === "deposit" 
      ? currentDue + amount 
      : Math.max(0, currentDue - amount);
  
    // Update with last transaction date
    await updateDoc(customerRef, {
      currentDue: newDue,
      lastTransaction: {
        type,
        amount,
        date: new Date().toISOString() // ISO format for easy sorting
      }
    });
  };

// Delete customer
export const deleteCustomer = async (id) => {
  await deleteDoc(doc(db, "customers", id));
};

// Search customers by phone
export const searchCustomersByPhone = async (phone) => {
  const q = query(
    collection(db, "customers"),
    where("phone", ">=", phone),
    where("phone", "<=", phone + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};