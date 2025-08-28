import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TabSwitcherProps {
  tabs: Array<{
    title: string;
    disabled?: boolean;
  }>;
  activeTab: string;
}

const TabSwitcher = (props: TabSwitcherProps) => {
  const {
    tabs,
    activeTab,
  } = props;
  const { t} = useTranslation('common');

  const activeTabStyles = `
    bg-white
    text-blue
    font-semibold
  `;

  return (
    <ul className="w-full bg-gray text-gray p-1 rounded-2xl">
      {
        tabs.map((tab) => (
          <Link to={`/${tab.title.toLowerCase()}`} className={`contents ${tab.disabled ? 'disabled' : ''}`} key={tab.title}>
          <li
            className={`
              inline-block
              w-1/2
              text-center
              py-2
              px-8
              text-[14px]
              rounded-2xl
              cursor-pointer
              ${activeTab === tab.title ? activeTabStyles : ''}
            `}
          >
            {t(tab.title)}
          </li>
          </Link>
        ))
      }
    </ul>
  )
};

export default TabSwitcher;