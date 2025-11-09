import { ArrowDown } from "../icons/ArrowDown";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import Logo from "./Logo";
import Nav from "./Nav";

const HeaderDesktop = () => {
  return (
    <div className="flex justify-between my-3 px-5 items-center">
      <Logo />
      <Nav />
      <div className="flex  gap-2">
        <span className=" border-b-2  border-[#4F694C] link-underline mr-2 ">Login</span>
        <div className="flex gap-1 items-center font-bold link-underline hover:cursor-pointer ">DE <span>{ArrowDown} </span></div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HeaderDesktop;
