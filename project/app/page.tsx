

import "../lib/i18n";
import MainComponent from "./components/main/MainComponent";
import BatchesHome from "./components/main/BatchesHome";
import RecipesHome from "./components/main/RecipesHome";
import PageWrapper from "./PageWraper";
import ShopHome from "./components/main/ShopHome";

export default function Home() {
 
  return (
    <PageWrapper>
    <MainComponent/>
    <RecipesHome/>
    <BatchesHome/>
    <ShopHome/>
    </PageWrapper>
   
  );
}
