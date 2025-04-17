import { useRouter } from "next/router";

export default function DashboardButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard")}
      className="text-gray-600 hover:text-gray-800 px-4 py-2 cursor-pointer"
    >
      Go To Dashboard
    </button>
  );
}