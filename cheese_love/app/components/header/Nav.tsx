import Link from "next/link"


const Nav = () => {
  return (
    <ul className="flex  gap-3 text-[14px] md:text-base md:gap-7">
        <li className="link-underline">
            <Link href={"#"}>Rezepte</Link>
        </li>
        <li className="link-underline">
            <Link href={"#"}>Shop</Link>
        </li>
        <li className="link-underline">
            <Link href={"#"}>Tagebuch</Link>
        </li>
    </ul>
  )
}

export default Nav