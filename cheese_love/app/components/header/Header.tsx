import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

const Header = () => {
  return (
    <>
      <div className="sm:hidden">
        <HeaderMobile />
      </div>
      <div className="hidden sm:block">
        <HeaderDesktop />
      </div>
    </>
  );
};

export default Header;
