"use client"
import { useTranslation } from "next-i18next";
import "../lib/i18n";
import MainComponent from "./components/main/MainComponent";
import BatchesHome from "./components/main/BatchesHome";
import RecipesHome from "./components/main/RecipesHome";
import PageWrapper from "./PageWraper";

export default function Home() {
  const { t } = useTranslation();
  return (
    <PageWrapper>
    <MainComponent/>
    <RecipesHome/>
    <BatchesHome/>
    </PageWrapper>
   
  );
}
