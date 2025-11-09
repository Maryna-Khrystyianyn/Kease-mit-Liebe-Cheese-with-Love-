import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

const Header = () => {
  return (
    <>
      <div className="md:hidden">
        <HeaderMobile />
      </div>
      <div className="hidden md:block">
        <HeaderDesktop />
      </div>
    </>
  );
};

export default Header;
