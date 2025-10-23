import React from "react";
import { Button, ButtonProps } from "@mui/material";

type ButtonVariantType = "primary" | "secondary" | "neutral";
type ButtonVisualType = "contained" | "outlined" | "text";

interface CustomButtonProps extends ButtonProps {
  label: string;
  variantType?: ButtonVariantType; // controla a paleta (azul, dourado, cinza)
  visualType?: ButtonVisualType;   // controla o estilo visual (contido, contornado, texto)
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  disabled,
  type = "button",
  onClick,
  fullWidth = false,
  size = "medium",
  variantType = "primary",
  visualType = "contained",
  ...rest
}) => {
  // 🎨 Paleta personalizada
  const colors = {
    primary: {
      base: "#1e40af", // azul principal
      hover: "#1e3a8a",
      text: "#ffffff",
      border: "#1e40af",
      detail: "#b88e44", // dourado nos detalhes
    },
    secondary: {
      base: "#b88e44", // dourado principal
      hover: "#9c7936",
      text: "#ffffff",
      border: "#b88e44",
      detail: "#1e40af",
    },
    neutral: {
      base: "#f3f4f6", // cinza claro
      hover: "#e5e7eb",
      text: "#1f2937", // cinza escuro
      border: "#d1d5db",
      detail: "#b88e44",
    },
  };

  const color = colors[variantType];

  // 🎨 Estilo base adaptado à variante visual
  const getButtonStyles = () => {
    switch (visualType) {
      case "outlined":
        return {
          backgroundColor: "transparent",
          border: `1.5px solid ${color.border}`,
          color: color.border,
          "&:hover": {
            borderColor: color.detail,
            backgroundColor: `${color.detail}10`,
            boxShadow: `0 0 8px ${color.detail}40`,
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: `0 0 0 3px ${color.detail}66`,
          },
        };

      case "text":
        return {
          backgroundColor: "transparent",
          color: color.base,
          "&:hover": {
            color: color.detail,
            backgroundColor: `${color.detail}10`,
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: `0 0 0 2px ${color.detail}66`,
          },
        };

      default: // "contained"
        return {
          backgroundColor: color.base,
          color: color.text,
          border: "none",
          "&:hover": {
            backgroundColor: color.hover,
            borderColor: color.detail,
            boxShadow: `0 0 10px ${color.detail}40`,
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: `0 0 0 3px ${color.detail}66`,
          },
        };
    }
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      variant="contained"
      {...rest}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderRadius: 2,
        px: 2.5,
        py: 1.2,
        transition: "all 0.25s ease-in-out",
        "&:disabled": {
          backgroundColor: "#cbd5e1",
          color: "#f8fafc",
          borderColor: "#e2e8f0",
        },
        ...getButtonStyles(),
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
