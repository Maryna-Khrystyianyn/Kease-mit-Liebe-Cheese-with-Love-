import { Cart } from "../icons/Cart";
import BurgerMenu from "./Burger-menu";
import Login from "./Login";
import Logo from "./Logo";


const HeaderMobile = () => {
  
  return (
    <div className="flex justify-between items-center p-2 sm:mt-2 sm:px-4">
      <Logo />
      <div className="flex gap-2 sm:gap-6 ">
        <Login/>

        <span className="link-underline "> <div className="sm:pt-2 scale-75">{Cart}</div></span>
        <div className="border-l-2 border-[#4F694C] sm:pl-2">
          <BurgerMenu />
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
