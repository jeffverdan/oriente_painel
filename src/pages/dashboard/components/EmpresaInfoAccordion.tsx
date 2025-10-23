import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Box,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { Processo } from "@/types/processo";

interface EmpresaInfoAccordionProps {
  isApiInfoOpen: boolean;
  setIsApiInfoOpen: (value: boolean) => void;
  formData: Partial<Processo>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 🔹 Estilo refinado do Accordion
const StyledAccordion = styled(Accordion)(() => ({
  backgroundColor: "#fafafa",
  border: "1px solid #e2e8f0",
  borderRadius: "10px !important",
  boxShadow: "none",
  "&:before": { display: "none" },
  "& .MuiAccordionSummary-root": {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
  },
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
  },
}));

const EmpresaInfoAccordion: React.FC<EmpresaInfoAccordionProps> = ({
  isApiInfoOpen,
  setIsApiInfoOpen,
  formData,
  handleChange,
}) => {
  const empresa = formData?.empresa;

  return (
    <StyledAccordion
      expanded={isApiInfoOpen}
      onChange={() => setIsApiInfoOpen(!isApiInfoOpen)}      
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={600} color="primary">
          Informações da Empresa (Receita Federal)
        </Typography>
      </AccordionSummary>

      {/* 🔸 Envolvemos o conteúdo com Collapse para animar a abertura */}
      <Collapse in={isApiInfoOpen} timeout={1000} unmountOnExit>
        <AccordionDetails sx={{ bgcolor: "white", p: 3 }}>
          {/* Situação / Porte / Natureza */}
          <Grid container spacing={2} mb={2}>
            <Grid>
              <TextField
                label="Situação"
                value={empresa?.situacao || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="Porte"
                value={empresa?.porte || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="Natureza Jurídica"
                value={empresa?.natureza_juridica || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
          </Grid>

          {/* Atividades */}
          <Grid container spacing={2} mb={3}>
            <Grid>
              <Typography variant="subtitle2" mb={1}>
                Atividade Principal
              </Typography>
              <Box
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  p: 2,
                  bgcolor: "#f9fafb",
                  minHeight: "80px",
                }}
              >
                {empresa?.atividades?.filter((a) => a.tipo === "principal")
                  .length ? (
                  empresa.atividades
                    .filter((a) => a.tipo === "principal")
                    .map((a) => (
                      <Box key={a.id}>
                        <Typography fontWeight={600}>{a.cnae_codigo}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.descricao}
                        </Typography>
                      </Box>
                    ))
                ) : (
                  <Typography color="text.disabled">N/A</Typography>
                )}
              </Box>
            </Grid>

            <Grid>
              <Typography variant="subtitle2" mb={1}>
                Atividades Secundárias
              </Typography>
              <Box
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  p: 2,
                  bgcolor: "#f9fafb",
                  maxHeight: "140px",
                  overflowY: "auto",
                }}
              >
                {empresa?.atividades?.filter((a) => a.tipo === "secundaria")
                  .length ? (
                  empresa.atividades
                    .filter((a) => a.tipo === "secundaria")
                    .map((a) => (
                      <Box key={a.id} mb={1}>
                        <Typography fontWeight={600}>{a.cnae_codigo}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.descricao}
                        </Typography>
                      </Box>
                    ))
                ) : (
                  <Typography color="text.disabled">N/A</Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Endereço */}
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Endereço
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid>
              <TextField
                label="Logradouro"
                value={empresa?.logradouro || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="Número"
                value={empresa?.numero || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="Complemento"
                value={empresa?.complemento || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="Bairro"
                value={empresa?.bairro || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="Município"
                value={empresa?.municipio || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="UF"
                value={empresa?.uf || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
            <Grid>
              <TextField
                label="CEP"
                value={empresa?.cep || ""}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Simples e SIMEI */}
          <Grid container spacing={2}>
            <Grid>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Simples Nacional
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!empresa?.simples_optante}
                    disabled
                    sx={{
                      color: "#b88e44",
                      "&.Mui-checked": { color: "#b88e44" },
                    }}
                  />
                }
                label="Optante"
              />
              <TextField
                label="Data Opção"
                value={empresa?.simples_data_opcao || ""}
                fullWidth
                size="small"
                margin="dense"
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Data Exclusão"
                value={empresa?.simples_data_exclusao || ""}
                fullWidth
                size="small"
                margin="dense"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>

            <Grid>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                SIMEI
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!empresa?.simei_optante}
                    disabled
                    sx={{
                      color: "#b88e44",
                      "&.Mui-checked": { color: "#b88e44" },
                    }}
                  />
                }
                label="Optante"
              />
              <TextField
                label="Data Opção"
                value={empresa?.simei_data_opcao || ""}
                fullWidth
                size="small"
                margin="dense"
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Data Exclusão"
                value={empresa?.simei_data_exclusao || ""}
                fullWidth
                size="small"
                margin="dense"
                slotProps={{ input: { readOnly: true } }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Collapse>
    </StyledAccordion>
  );
};

export default EmpresaInfoAccordion;
