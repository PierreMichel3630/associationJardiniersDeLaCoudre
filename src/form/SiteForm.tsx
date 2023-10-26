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
import deburr from "lodash.deburr";
import { useState } from "react";
import * as Yup from "yup";
import { insertAdresse, updateAdresse } from "../api/adresse";
import { insertSite, updateSite } from "../api/site";
import { BUCKET_IMAGE, storeFile } from "../api/storage";
import { MessageSnackbar } from "../components/Snackbar";
import { FileUploadInput } from "../components/input/FileUploadInput";
import { Adresse, AdresseInsert, AdresseUpdate } from "../model/Adresse";
import { Site, SiteInsert, SiteUpdate } from "../model/Site";

interface Props {
  onValid: () => void;
  editValue: null | Site;
}
export const SiteForm = ({ onValid, editValue }: Props) => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  const initialValue: {
    nom: string;
    adresse: string;
    codepostal: string;
    ville: string;
    image: null | File | string;
  } = editValue
    ? {
        nom: editValue.nom,
        adresse: editValue.adresse.adresse,
        codepostal: editValue.adresse.codepostal,
        ville: editValue.adresse.ville,
        image: editValue.image,
      }
    : {
        nom: "",
        adresse: "",
        codepostal: "",
        ville: "",
        image: null,
      };

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Veuillez renseigner un nom"),
    adresse: Yup.string().required("Veuillez renseigner une adresse"),
    codepostal: Yup.string().required("Veuillez renseigner un code postal"),
    ville: Yup.string().required("Veuillez renseigner une ville"),
    image: Yup.mixed().nullable(),
  });

  const uploadFile = async (bucket: string, name: string, file: File) => {
    const { data } = await storeFile(bucket, name, file);
    return data;
  };

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
          let file: any = values.image;
          if (values.image !== null && typeof values.image !== "string") {
            const image = values.image as unknown as File;
            const uploadFileRes = await uploadFile(
              BUCKET_IMAGE,
              deburr(image.name),
              image
            );
            file = uploadFileRes ? uploadFileRes.path : file;
          }
          const adresseUpdate: AdresseUpdate = {
            id: editValue.adresse.id,
            adresse: values.adresse,
            codepostal: values.codepostal,
            ville: values.ville,
          };
          const { data } = await updateAdresse(adresseUpdate);
          if (data !== null) {
            const adresse = data as Adresse;
            const siteUpdate: SiteUpdate = {
              image: file,
              id: editValue.id,
              nom: values.nom,
              adresse: adresse.id,
            };
            const { error } = await updateSite(siteUpdate);
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
          let file = null;
          if (values.image !== null) {
            const image = values.image as unknown as File;
            file = await uploadFile(BUCKET_IMAGE, deburr(image.name), image);
          }
          const adresseInsert: AdresseInsert = {
            adresse: values.adresse,
            codepostal: values.codepostal,
            ville: values.ville,
          };
          const { data } = await insertAdresse(adresseInsert);
          if (data !== null) {
            const adresse = data as Adresse;
            const siteInsert: SiteInsert = {
              image: file !== null ? file.path : file,
              nom: values.nom,
              adresse: adresse.id,
            };
            const { error } = await insertSite(siteInsert);
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
        <Grid item xs={12}>
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
          <FileUploadInput formik={formik} />
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
