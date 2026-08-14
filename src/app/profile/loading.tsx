import Loader from "@/components/Loader";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    </div>
  );
}
