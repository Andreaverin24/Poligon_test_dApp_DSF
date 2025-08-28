// header/Loading.tsx

import { useAppKit } from "@reown/appkit/react";
import { useTranslation } from "react-i18next";

// components
import Button from "../../../components/CastomButtonOneLine";
import Spinner from "../../components/Spinner";

const NotConnected = () => {
  const { open } = useAppKit();
  const { t } = useTranslation("header");

  return (
    <>
      {/* Mobile version */}
      <div className="flex items-center tablet:hidden button__container-mobile">
        <Button
          disabled={true}
          /*variant="outline"*/
          variant="filled"
          onClick={() => open({ view: "Connect" })}
          // className="flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap"
        >
          <Spinner size="sm" />
          {t("")}
        </Button>
      </div>
      {/* Tablet+ version */}
      <div className="hidden tablet:flex items-center button__container">
        <Button
          disabled={true}
          /*variant="outline"*/
          variant="filled"
          onClick={() => open({ view: "Connect" })}
          // className="flex items-center gap-2 px-6 py-2 text-sm font-medium whitespace-nowrap"
        >
          <Spinner size="sm" />
          {t("connecting")}
        </Button>
      </div>
    </>
  );
};

export default NotConnected;
