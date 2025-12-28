"use client"
import { useTranslation } from "next-i18next";
import "../lib/i18n";
import MainComponent from "./components/main/MainComponent";
import BatchesHome from "./components/main/BatchesHome";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
    <MainComponent/>
    <BatchesHome/>
    </>
   
  );
}
