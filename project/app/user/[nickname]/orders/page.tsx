import PageWrapper from "@/app/PageWraper";
import UserProfile from "../UserProfile";
import ClientUserOrders from "./ClientUserOrders";
import { getUserFromToken, UserFromToken } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UserOrdersPage() {
  const curentUser: UserFromToken | null = await getUserFromToken();

  if (!curentUser) {
    redirect("/register");
  }
  const user = await prisma.users.findUnique({
    where: { nick_name: curentUser.nick_name },
  });
  const orders = await prisma.orders.findMany({
    where: { user_nick: curentUser.nick_name },
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      total_price: true,
      delivery_price: true,
      discount: true,
      status: true,
      payment_status: true,
    },
  });

  const formatted = orders.map((o) => ({
    id: o.id,
    date: o.date.toISOString(),
    total:
      Number(o.total_price) +
      Number(o.delivery_price) -
      (Number(o.discount) || 0),
    status: o.status,
    payment_status: o.payment_status,
  }));

  return (
    <PageWrapper>
      <Link href={`/user/${curentUser.nick_name}`} className="ml-10 mr-3 text-(--text_gray) text-[14px] link-underline ">{`Profil >`}</Link>
      <div className="sm:mx-10 mx-3 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5 ">
        <div className="max-w-3xl mx-auto sm:p-6 py-6 lg:col-span-1">
          {curentUser && user && (
            <UserProfile user={user} curentUserNick={curentUser.nick_name} />
          )}
        </div>
        <div className="lg:col-span-2 2xl:col-span-3">
          <ClientUserOrders orders={formatted} />
        </div>
      </div>
    </PageWrapper>
  );
}
