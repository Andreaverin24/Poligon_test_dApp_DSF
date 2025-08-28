// DropdownItem.tsx

const DropdownItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-[10px]">
      {children}
    </div>
  );
};

export default DropdownItem;
