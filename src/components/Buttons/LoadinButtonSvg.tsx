import React from "react";
import styles from "./styles.module.css";
export default function LoadingSvg() {
  return (
    <svg className={styles.svgLoading} viewBox="25 25 50 50">
      <circle className={styles.circleLoading} r="20" cy="50" cx="50"></circle>
    </svg>
  );
}
