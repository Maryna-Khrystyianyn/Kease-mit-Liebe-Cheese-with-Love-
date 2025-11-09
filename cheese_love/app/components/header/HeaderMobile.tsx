import Logo from "./Logo"


const HeaderMobile = () => {
  return (
    <div className="flex justify-between items-center p-2 sm:px-5">
        <Logo/>
        <div className="flex gap-2 ">
            Login 
            <div className="border-l border-[#4F694C]"> <span className="pl-2">===</span> </div>
        </div>
    </div>
  )
}

export default HeaderMobile