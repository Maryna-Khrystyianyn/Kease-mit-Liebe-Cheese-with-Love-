import PageWrapper from "@/app/PageWraper";
import type { Batch } from "@/types/global";
import { BatchItem } from "./Batch";
import BatchSideBar from "../BatchSideBar";
import MobileBatchesBar from "../MobileBatchesBar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BatchPage({ params }: PageProps) {
  const { id } = await params;
  const batchId = Number(id);

  const res = await fetch(
    `/api/cheese-batches/${batchId}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) {
    return <p>Batch nicht gefunden</p>;
  }

  const batchData = await res.json();
  const batch: Batch = {
    id: batchData.id,
    image: batchData.foto,
    date: batchData.date_batch,

    recipeName: batchData.recipes.name,
    recipeId: batchData.recipe_id,
    agingDays: batchData.recipes.aging ?? 0,
    recipeCategory: batchData.recipes.recipes_categories.name,

    // Milck Array
    milkArray: batchData.milk_in_batch.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: { ingredients: { name: any }; amount: any }) => ({
        type: m.ingredients.name,
        amount: m.amount,
      })
    ),

    cheeseWeight: batchData.cheeseweight
      ? Number(batchData.cheeseweight)
      : null,

    createdAt: batchData.created_at,
    readyAt: batchData.ready_at,

    description: batchData.description,

    user: {
      nickName: batchData.users.nick_name,
      username: batchData.users.username,
      avatar: batchData.users.avatar,
    },
  };

 

  return (
    <PageWrapper>
      <MobileBatchesBar
        activeId={batch.id}
        nickName={batch.user.nickName}
        username={batch.user.username}
        avatar={batch.user.avatar}
      />
      <div className="md:flex md:pl-5 ">
        <div className=" md:block hidden">
          <BatchSideBar
            activeId={batch.id}
            nickName={batch.user.nickName}
            username={batch.user.username}
            avatar={batch.user.avatar}
          />
        </div>
        <div>
          <BatchItem
            batch={batch}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
