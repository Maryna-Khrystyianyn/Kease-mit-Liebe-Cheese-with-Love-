import PageWrapper from "@/app/PageWraper";
import UserCheese from "./UserCheese";
import UserProfile from "./UserProfile";
import { prisma } from "@/lib/prisma";
import UserBatchesCarousel from "@/app/components/batsh/UserBatchesCarousel";

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

  return (
    <PageWrapper>
      <div className="mx-10 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5 ">
        <div className="max-w-3xl mx-auto p-6 lg:col-span-1">
          <UserProfile user={user} />
        </div>
        <div className="lg:col-span-2 2xl:col-span-3">
          <UserBatchesCarousel nickname={user.nick_name} />
          <UserCheese nickname={user.nick_name} />
        </div>
      </div>
    </PageWrapper>
  );
}
