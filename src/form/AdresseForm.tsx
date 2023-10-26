import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

export const AdresseForm = () => {
  const [message, setMessage] = useState("");

  const initialValue: {
    numero: string;
    nom: string;
    codepostal: string;
    ville: string;
  } = {
    numero: "",
    nom: "",
    codepostal: "",
    ville: "",
  };

  const validationSchema = Yup.object().shape({
    numero: Yup.string(),
    nom: Yup.string().required("Veuillez renseigner un adresse"),
    codepostal: Yup.string().required("Veuillez renseigner un code postal"),
    ville: Yup.string().required("Veuillez renseigner une ville"),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
      } catch (err) {
        setMessage("Oups une erreur est survenue. Veuillez ressayer");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.numero && formik.errors.numero)}
          >
            <InputLabel htmlFor="numero-input">Numéro</InputLabel>
            <OutlinedInput
              id="numero-input"
              type="text"
              value={formik.values.numero}
              name="numero"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Numéro"
              inputProps={{}}
            />
            {formik.touched.numero && formik.errors.numero && (
              <FormHelperText error id="error-numero">
                {formik.errors.numero}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>{" "}
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.nom && formik.errors.nom)}
          >
            <InputLabel htmlFor="nom-input">Adresse</InputLabel>
            <OutlinedInput
              id="nom-input"
              type="text"
              value={formik.values.nom}
              name="nom"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Adresse"
              inputProps={{}}
            />
            {formik.touched.nom && formik.errors.nom && (
              <FormHelperText error id="error-nom">
                {formik.errors.nom}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.codepostal && formik.errors.codepostal
            )}
          >
            <InputLabel htmlFor="codepostal-input">Code Postal</InputLabel>
            <OutlinedInput
              id="codepostal-input"
              type="text"
              value={formik.values.codepostal}
              name="codepostal"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Code Postal"
              inputProps={{}}
            />
            {formik.touched.codepostal && formik.errors.codepostal && (
              <FormHelperText error id="error-codepostal">
                {formik.errors.codepostal}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.ville && formik.errors.ville)}
          >
            <InputLabel htmlFor="ville-input">Ville</InputLabel>
            <OutlinedInput
              id="ville-input"
              type="text"
              value={formik.values.ville}
              name="ville"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Ville"
              inputProps={{}}
            />
            {formik.touched.ville && formik.errors.ville && (
              <FormHelperText error id="error-ville">
                {formik.errors.ville}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};
