"use client";
import { useTranslation } from "@/node_modules/react-i18next";
import "../../../lib/i18n";
import { useEffect } from "react";
const Login = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage("de"); // immer de
  }, []);


 
  return (
    <div className="sm:text-[22px] lg:text-[18px] link-underline ">
      {" "}
      {t("login")}
    </div>
  );
};

export default Login;
