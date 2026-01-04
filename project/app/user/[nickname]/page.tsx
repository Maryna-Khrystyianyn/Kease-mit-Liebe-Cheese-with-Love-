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
      <div className="mx-10">
        <div className="max-w-3xl mx-auto p-6">
          <UserProfile user={user} />
        </div>
        <UserBatchesCarousel nickname={user.nick_name} />
        <UserCheese nickname={user.nick_name} />
      </div>
    </PageWrapper>
  );
}