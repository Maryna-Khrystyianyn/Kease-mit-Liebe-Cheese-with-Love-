"use client"
import { useTheme } from "next-themes";
import styles from "./theme.module.css";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className={styles.daynight}>
      <input
        type="checkbox"
        className={styles.daynight__checkbox}
        checked={theme === "dark"}
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <span className={styles.daynight__sky}>
        <span className={styles.daynight__stars}></span>
        <span className={styles.daynight__morestars}></span>
        <span className={styles.daynight__sunmoon}></span>
      </span>
    </label>
  );
}