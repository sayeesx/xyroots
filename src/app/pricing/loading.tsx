import Loader from "@/components/Loader";

export default function PricingLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    </div>
  );
}
