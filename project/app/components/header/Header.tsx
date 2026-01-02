import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import "../../../lib/i18n";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-(--bg) side-bar-button-shadow transition-colors duration-300">
      <div className="lg:hidden">
        <HeaderMobile />
      </div>
      <div className="hidden lg:block">
        <HeaderDesktop />
      </div>
    </div>
  );
};

export default Header;
