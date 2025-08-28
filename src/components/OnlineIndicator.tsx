// components/OnlineIndicator.tsx

const OnlineIndicator = ({ label }: { label?: string }) => {
    return (
      <div className="online-span flex items-center gap-1 text-[12px]">
        <p className="blinking-dot text-green-500">•</p>
        {label && <span className="text-gray-600">{label}</span>}
      </div>
    );
  };
  
  export default OnlineIndicator;
  
