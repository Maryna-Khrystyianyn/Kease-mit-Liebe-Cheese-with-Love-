
import ThemeSwitcher from "../theme/ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import Nav from "./Nav";

const HeaderDesktop = () => {
  return (
    <div className="flex justify-between my-3 px-5 items-center">
      <Logo />
      <Nav />
      
      <div className="flex  gap-3">
        <span className=" border-b-2  border-[#4F694C] link-underline mr-2 ">Login</span>
        <LanguageSwitcher/>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HeaderDesktop;
