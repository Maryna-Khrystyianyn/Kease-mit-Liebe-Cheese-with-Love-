import Link from "next/link";


export default function AdminPage (){
   return(
    <div className="mx-5 md:mx-10">

<h1 className="font-bold">Admin Panel</h1>

<ul>
  <li><Link href="/shop/products/add">➕ Produkt hinzufügen</Link></li>
  <li><Link href="/admin/categories/new">➕ Kategorie erstellen</Link></li>
  <li><Link href="/recipe/add">➕ Rezept hinzufügen</Link></li>
</ul>
    </div>
   ) 
}