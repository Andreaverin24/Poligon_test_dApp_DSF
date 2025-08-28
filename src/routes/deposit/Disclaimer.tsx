import { useTranslation } from 'react-i18next';

// icons
import { ReactComponent as InformIcon } from '../../assets/images/common/inform.svg?react';

// components
import Card from '../../components/Card';
import Button from '../../components/CustomButton';

const Disclaimer = () => {
  const { t } = useTranslation('deposit');

  return (
    <section className="mt-8">
      <Card>
        <div className="tablet:flex items-center justify-between">
          <div className="flex items-center tablet:flex-row-reverse tablet:w-3/3">
            <p className="text-[14px] tablet:text-base">
              {t('deposit_description')}
            </p>
            <InformIcon className="w-8 h-8 ml-4 min-w-fit tablet:ml-0 tablet:mr-8" />
          </div>
          {/* <div className="mt-4">
            <Button variant="outline" onClick={() => null}>
              {t('what_the_fee')}
            </Button>
          </div> */}
        </div>
      </Card>
    </section>
  );
};

export default Disclaimer;
