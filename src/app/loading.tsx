import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-xyroots-cream/80 z-50 backdrop-blur-sm">
      <Loader />
    </div>
  );
}
