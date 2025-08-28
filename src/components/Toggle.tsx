interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

const Toggle = (props: ToggleProps) => {
  const {
    checked,
    onChange,
  } = props;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <span
          className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-blue after:rounded-full after:h-5 after:w-5 after:transition-all bg-white peer-checked:bg-blue shadow-inner"></span>
    </label>
  );

};

export default Toggle;
