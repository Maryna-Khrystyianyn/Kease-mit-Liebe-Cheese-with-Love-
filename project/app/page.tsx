"use client"
import { useTranslation } from "next-i18next";
import "../lib/i18n";
import MainComponent from "./components/main/MainComponent";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
    <MainComponent/>
     <div className=" my-30 lg:text-6xl text-3xl text-center p-10 font-bold lg:mx-30">
      
      {t("inDev")}
    
    </div>
    </>
   
  );
}
