import {
  AlertColor,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { insertAdherent, updateAdherent } from "../api/adherent";
import { insertAdresse, updateAdresse } from "../api/adresse";
import { MessageSnackbar } from "../components/Snackbar";
import { Adherent, AdherentInsert, AdherentUpdate } from "../model/Adherent";
import { Adresse, AdresseInsert, AdresseUpdate } from "../model/Adresse";

interface Props {
  onValid: () => void;
  editValue: null | Adherent;
}
export const AdherentForm = ({ onValid, editValue }: Props) => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  const initialValue: {
    nom: string;
    prenom: string;
    mail: string;
    telephone: string;
    conjointnom: string;
    conjointprenom: string;
    adresse: string;
    codepostal: string;
    ville: string;
  } = editValue
    ? {
        nom: editValue.nom,
        prenom: editValue.prenom,
        mail: editValue.mail,
        telephone: editValue.telephone,
        conjointnom: editValue.conjointnom,
        conjointprenom: editValue.conjointprenom,
        adresse: editValue.adresse.adresse,
        codepostal: editValue.adresse.codepostal,
        ville: editValue.adresse.ville,
      }
    : {
        nom: "",
        prenom: "",
        mail: "",
        telephone: "",
        conjointnom: "",
        conjointprenom: "",
        adresse: "",
        codepostal: "",
        ville: "",
      };

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Veuillez renseigner un nom"),
    prenom: Yup.string().required("Veuillez renseigner un prénom"),
    mail: Yup.string().required("Veuillez renseigner un mail"),
    telephone: Yup.string(),
    conjointnom: Yup.string(),
    conjointprenom: Yup.string(),
    adresse: Yup.string().required("Veuillez renseigner une adresse"),
    codepostal: Yup.string().required("Veuillez renseigner un code postal"),
    ville: Yup.string().required("Veuillez renseigner une ville"),
  });

  const getSnackbarError = () => {
    setSeverity("error");
    setMessage("Oups une erreur est survenue. Veuillez ressayer");
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editValue) {
          const adresseUpdate: AdresseUpdate = {
            id: editValue.adresse.id,
            adresse: values.adresse,
            codepostal: values.codepostal,
            ville: values.ville,
          };
          const { data } = await updateAdresse(adresseUpdate);
          if (data !== null) {
            const adresse = data as Adresse;
            const adherentUpdate: AdherentUpdate = {
              id: editValue.id,
              nom: values.nom,
              prenom: values.prenom,
              conjointnom: values.conjointnom,
              conjointprenom: values.conjointprenom,
              mail: values.mail,
              telephone: values.telephone,
              adresse: adresse.id,
            };
            const { error } = await updateAdherent(adherentUpdate);
            if (error === null) {
              setSeverity("success");
              setMessage("Votre ajout a été pris en compte");
              onValid();
            } else {
              getSnackbarError();
            }
          } else {
            getSnackbarError();
          }
        } else {
          const adresseInsert: AdresseInsert = {
            adresse: values.adresse,
            codepostal: values.codepostal,
            ville: values.ville,
          };
          const { data } = await insertAdresse(adresseInsert);
          if (data !== null) {
            const adresse = data as Adresse;
            const adherentInsert: AdherentInsert = {
              nom: values.nom,
              prenom: values.prenom,
              conjointnom: values.conjointnom,
              conjointprenom: values.conjointprenom,
              mail: values.mail,
              telephone: values.telephone,
              adresse: adresse.id,
            };
            const { error } = await insertAdherent(adherentInsert);
            if (error === null) {
              setSeverity("success");
              setMessage("Votre ajout a été pris en compte");
              onValid();
            } else {
              getSnackbarError();
            }
          } else {
            getSnackbarError();
          }
        }
      } catch (err) {
        getSnackbarError();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.prenom && formik.errors.prenom)}
          >
            <InputLabel htmlFor="prenom-input">Prénom</InputLabel>
            <OutlinedInput
              id="prenom-input"
              type="text"
              value={formik.values.prenom}
              name="prenom"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Prénom"
              inputProps={{}}
            />
            {formik.touched.prenom && formik.errors.prenom && (
              <FormHelperText error id="error-prenom">
                {formik.errors.prenom}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.nom && formik.errors.nom)}
          >
            <InputLabel htmlFor="nom-input">Nom</InputLabel>
            <OutlinedInput
              id="nom-input"
              type="text"
              value={formik.values.nom}
              name="nom"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Nom"
              inputProps={{}}
            />
            {formik.touched.nom && formik.errors.nom && (
              <FormHelperText error id="error-nom">
                {formik.errors.nom}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.conjointprenom && formik.errors.conjointprenom
            )}
          >
            <InputLabel htmlFor="conjointprenom-input">
              Conjoint Prénom
            </InputLabel>
            <OutlinedInput
              id="conjointprenom-input"
              type="text"
              value={formik.values.conjointprenom}
              name="conjointprenom"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Conjoint Prénom"
              inputProps={{}}
            />
            {formik.touched.conjointprenom && formik.errors.conjointprenom && (
              <FormHelperText error id="error-conjointprenom">
                {formik.errors.conjointprenom}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.conjointnom && formik.errors.conjointnom
            )}
          >
            <InputLabel htmlFor="conjointnom-input">Conjoint Nom</InputLabel>
            <OutlinedInput
              id="conjointnom-input"
              type="text"
              value={formik.values.conjointnom}
              name="conjointnom"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Conjoint Nom"
              inputProps={{}}
            />
            {formik.touched.conjointnom && formik.errors.conjointnom && (
              <FormHelperText error id="error-conjointnom">
                {formik.errors.conjointnom}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.telephone && formik.errors.telephone)}
          >
            <InputLabel htmlFor="telephone-input">Téléphone</InputLabel>
            <OutlinedInput
              id="telephone-input"
              type="text"
              value={formik.values.telephone}
              name="telephone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Téléphone"
              inputProps={{}}
            />
            {formik.touched.telephone && formik.errors.telephone && (
              <FormHelperText error id="error-telephone">
                {formik.errors.telephone}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.mail && formik.errors.mail)}
          >
            <InputLabel htmlFor="mail-input">Mail</InputLabel>
            <OutlinedInput
              id="mail-input"
              type="text"
              value={formik.values.mail}
              name="mail"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Mail"
              inputProps={{}}
            />
            {formik.touched.mail && formik.errors.mail && (
              <FormHelperText error id="error-mail">
                {formik.errors.mail}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.adresse && formik.errors.adresse)}
          >
            <InputLabel htmlFor="adresse-input">Adresse</InputLabel>
            <OutlinedInput
              id="adresse-input"
              type="text"
              value={formik.values.adresse}
              name="adresse"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Adresse"
              inputProps={{}}
            />
            {formik.touched.adresse && formik.errors.adresse && (
              <FormHelperText error id="error-adresse">
                {formik.errors.adresse}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={8}>
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
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            {editValue ? "Modifier" : "Ajouter"}
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </form>
  );
};
