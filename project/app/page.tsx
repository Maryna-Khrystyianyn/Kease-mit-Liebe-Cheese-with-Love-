"use client"
import { useTranslation } from "next-i18next";
import "../lib/i18n";
import MainComponent from "./components/main/MainComponent";
import BatchesHome from "./components/main/BatchesHome";
import RecipesHome from "./components/main/RecipesHome";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
    <MainComponent/>
    <RecipesHome/>
    <BatchesHome/>
    </>
   
  );
}
