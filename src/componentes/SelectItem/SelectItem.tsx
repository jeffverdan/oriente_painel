import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface SelectOption {
  id: string | number;
  label: string;
  value: string;
  icon?: React.ReactNode; // Novo: ícone opcional por opção
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  startIcon?: React.ReactNode; // Novo: ícone fixo no início
  phAtivo?: boolean;
  required?: boolean;
}

const SelectItem: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  fullWidth = true,
  size = "medium",
  disabled = false,
  startIcon,
  phAtivo,
  required,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      <FormControl
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: 2,
            bgcolor: "white",
            transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b88e44", // Cor dourada no hover
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            // borderColor: "#b88e44", // Também mantém o dourado quando focado
          },
          "& .MuiInputBase-input": {
            padding: "10px 14px",
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#333333'
          },
          "& .MuiFormLabel-root": {
            marginTop: '-6px'
          },
          "& .MuiFormLabel-root.MuiInputLabel-shrink": {
            marginTop: '0px'
          }
        }}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          required={required}
          onChange={handleChange}
          IconComponent={ExpandMoreIcon}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start" sx={{ pl: 1 }}>
                {startIcon}
              </InputAdornment>
            ) : undefined
          }
        >
          <MenuItem value={phAtivo ? 0 : ''} disabled={!phAtivo} className={phAtivo ? '' : 'placeholder'}>
            {placeholder}
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.id} value={opt.value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {opt.icon && <Box sx={{ fontSize: 20 }}>{opt.icon}</Box>}
                {opt.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectItem;
