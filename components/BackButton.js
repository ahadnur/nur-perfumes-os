import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-gray-600 hover:text-gray-800 px-4 py-2 cursor-pointer"
    >
      ← Back
    </button>
  );
}