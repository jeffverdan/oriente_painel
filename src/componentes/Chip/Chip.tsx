import React from "react";
import { Chip, ChipProps } from "@mui/material";

export type ChipColor = "sky" | "yellow" | "green" | "red";

interface CustomChipProps extends Omit<ChipProps, "color"> {
  label: string;
  colorType?: ChipColor;
}

const ChipCustom: React.FC<CustomChipProps> = ({
  label,
  colorType = "sky",
  ...rest
}) => {
  // 🎨 Paleta personalizada
  const colors = {
    yellow: {
      bg: "#fef9c3", // bg-yellow-100
      text: "#854d0e", // text-yellow-800
      border: "#facc15",
    },
    sky: {
      bg: "#e0f2fe", // bg-sky-100
      text: "#075985", // text-sky-800
      border: "#38bdf8",
    },
    green: {
      bg: "#dcfce7", // bg-green-100
      text: "#166534", // text-green-800
      border: "#22c55e",
    },
    red: {
      bg: "#fee2e2", // bg-red-100
      text: "#991b1b", // text-red-800
      border: "#ef4444",
    },
  };

  const current = colors[colorType];

  return (
    <Chip
      label={label}
      {...rest}
      sx={{
        fontSize: "0.75rem", // text-xs
        fontWeight: 500,
        borderRadius: "9999px", // rounded-full
        px: 1,
        py: 0.5,
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
      }}
    />
  );
};

export default ChipCustom;
