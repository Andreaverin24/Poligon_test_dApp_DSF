
// icons
import { ReactComponent as Telegram } from '../assets/images/socials/telegram.svg?react';
import { ReactComponent as Twitter } from '../assets/images/socials/twitter.svg?react';
import { ReactComponent as Discord } from '../assets/images/socials/discord.svg?react';
import { ReactComponent as Youtube } from '../assets/images/socials/youtube.svg?react';
import { ReactComponent as Instagram } from '../assets/images/socials/instagram.svg?react';
import { ReactComponent as LinkedIn } from '../assets/images/socials/linkedin.svg?react';
import { ReactComponent as Mail } from '../assets/images/socials/mail.svg?react';

interface SocialsProps {
  short?: boolean;
}

const Socials = (props: SocialsProps) => {
  const{
    short,
  } = props;

  if (short) {
    return (
      <div className="flex items-center gap-4">
        <a href="https://t.me/DSF_Invest_in_DeFi" target="_blank" rel="noreferrer">
          <Telegram className="h-6 w-6" />
        </a>
        <a href="https://twitter.com/DsfFinance" target="_blank" rel="noreferrer">
          <Twitter className="h-6 w-6" />
        </a>
        <a href="mailto: godefi@dsf.finance" target="_blank" rel="noreferrer">
          <Mail className="h-6 w-6" />
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <a href="https://discord.gg/8jyTgJ23kw" target="_blank" rel="noreferrer">
        <Discord className="h-4 w-4" />
      </a>
      <a href="https://twitter.com/DsfFinance" target="_blank" rel="noreferrer">
        <Twitter className="h-4 w-4" />
      </a>
      <a href="https://www.youtube.com/@dsffinance" target="_blank" rel="noreferrer">
        <Youtube className="h-4 w-4" />
      </a>
      <a href="https://t.me/DSF_Invest_in_DeFi" target="_blank" rel="noreferrer">
        <Telegram className="h-4 w-4" />
      </a>
      <a href="https://instagram.com/dsf.finance?igshid=ZWQyN2ExYTkwZQ==" target="_blank" rel="noreferrer">
        <Instagram className="h-4 w-4" />
      </a>
      <a href="https://www.linkedin.com/company/dsffinance/?viewAsMember=true" target="_blank" rel="noreferrer">
        <LinkedIn className="h-4 w-4" />
      </a>
    </div>
  )
};

export default Socials;
