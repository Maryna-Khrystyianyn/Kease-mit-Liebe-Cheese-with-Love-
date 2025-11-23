
import { Cart } from "../icons/Cart";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import Login from "./Login";
import Logo from "./Logo";
import Nav from "./Nav";

const HeaderDesktop = () => {
  return (
    <div className="flex justify-between my-3 px-5 items-center">
      <Logo />
      <Nav />
      
      <div className="flex items-center gap-6">
        <span className=" border-b-2  border-[#4F694C]"><Login/></span>
        <span className="link-underline "> <div className="scale-75">{Cart}</div></span>
        
        <LanguageSwitcher/>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HeaderDesktop;
