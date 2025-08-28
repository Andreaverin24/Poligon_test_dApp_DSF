import { Dropdown } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';

interface DropdownProps {
  label: React.ReactNode;
  items: React.ReactNode[];
  itemsValues: Array<string>;
  onChange: (value: string) => void;
  withBorder?: boolean;
}

const customTheme: CustomFlowbiteTheme['dropdown'] = {
  inlineWrapper: `
    flex
    items-center
    justify-between
    py-[10px]
    px-4
    border
    border-[rgba(67,_64,_84,_0.2)]
    rounded-xl
    text-gray-900
    w-full
    text-[1rem]
  `,
};

const CustomDropdown = (props: DropdownProps) => {
  const {
    label,
    items,
    itemsValues,
    onChange,
    withBorder = false,
  } = props;

  return (
    <Dropdown inline label={label} theme={withBorder ? customTheme : undefined}>
        {
          items.map((item, index) => (
            <Dropdown.Item key={index} onClick={() => onChange(itemsValues[index])}>
              {item}
            </Dropdown.Item>
          ))
        }
    </Dropdown>
  )
};

export default CustomDropdown;
