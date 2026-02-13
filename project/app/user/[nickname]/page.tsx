import PageWrapper from "@/app/PageWraper";
import UserCheese from "./UserCheese";
import UserProfile from "./UserProfile";
import { prisma } from "@/lib/prisma";
import UserBatchesCarousel from "@/app/components/batsh/UserBatchesCarousel";
import { getUserFromToken, UserFromToken } from "@/app/utils/auth";
import { User } from "lucide-react";
import UserProductionChart from "@/app/components/user/UserProductionChart";

interface Params {
  params: Promise<{ nickname: string }>;
}

export default async function PublicUserPage({ params }: Params) {
  const { nickname } = await params;

  if (!nickname) {
    return <p>Nickname not provided</p>;
  }

  const user = await prisma.users.findUnique({
    where: { nick_name: nickname },
  });

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
      </div>
    );
  }

  const curentUser = await getUserFromToken();

  const isOwner = curentUser?.nick_name === user.nick_name;
  const isPublic = user.ispublic !== false;

  if (!isPublic && !isOwner) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto p-12 text-center my-10">
          <h1 className="text-4xl font-bold mb-6 text-(--text)">{user.nick_name}</h1>
          <div className="bg-(--olive_light/20) border border-(--olive_bright/30) rounded-2xl p-8">
            <p className="text-xl text-(--text) opacity-80">
              Dies ist ein privates Profil.
            </p>
            <p className="mt-2 text-neutral-500">
              Der Inhalt dieses Profils ist nur für den Besitzer sichtbar.
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="sm:mx-10 mx-3 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5 ">
        <div className="max-w-3xl mx-auto sm:p-6 py-6 lg:col-span-1">
          <UserProfile user={user} curentUserNick={curentUser?.nick_name} />
        </div>
        <div className="lg:col-span-2 2xl:col-span-3">
          <UserBatchesCarousel nickname={user.nick_name} />
          <UserCheese nickname={user.nick_name} />
          <UserProductionChart nickname={user.nick_name} />
        </div>
      </div>
    </PageWrapper>
  );
}
