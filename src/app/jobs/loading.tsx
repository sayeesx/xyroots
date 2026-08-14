import Loader from "@/components/Loader";

export default function JobsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    </div>
  );
}
