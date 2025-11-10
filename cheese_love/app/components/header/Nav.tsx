import Link from "next/link"


const Nav = () => {
  return (
    <ul className="flex gap-5">
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