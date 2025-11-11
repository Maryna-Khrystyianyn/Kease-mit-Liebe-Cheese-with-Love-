import BurgerMenu from "./Burger-menu"
import Logo from "./Logo"


const HeaderMobile = () => {
  return (
    <div className="flex justify-between items-center p-2 sm:mt-2 sm:px-4">
        <Logo/>
        <div className="flex gap-2 sm:gap-4 sm:text-[18px] ">
            Login 
            <div className="border-l-2 border-[#4F694C]"> <BurgerMenu/> </div>
        </div>
    </div>
  )
}

export default HeaderMobile