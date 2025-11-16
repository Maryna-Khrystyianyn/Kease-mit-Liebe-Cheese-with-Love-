"use client"
import { useTranslation } from "react-i18next";


const Login = () => {
    const { t } = useTranslation();
    console.log("Language",t);
  return (
    <div className="sm:text-[22px] lg:text-[18px] link-underline "> {t("login")}</div>
  )
}

export default Login