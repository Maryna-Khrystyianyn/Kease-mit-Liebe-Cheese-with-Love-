import Image from "next/image";

const Logo = () => {
  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        <Image
          src="/logo.png"
          alt="Käse mit Liebe Logo"
          width={60}
          height={60}
         className="w-[30px] h-[30px] sm:w-[60px] sm:h-[60px]"
        />
        <p className="flex flex-col font-bold leading-none text-base sm:text-4xl">
          Käse
          <span className="text-[12px]  sm:text-[18px]">
            mit Liebe
          </span>
        </p>
      </div>
    </>
  );
};

export default Logo;
