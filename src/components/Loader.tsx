export default function Loader() {
  return (
    <div className="custom-loader-wrapper">
      <svg viewBox="25 25 50 50" className="custom-loader-svg">
        <circle r={20} cy={50} cx={50} className="custom-loader-circle" />
      </svg>
    </div>
  );
}
