import {
  AlertColor,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useFormik } from "formik";
import deburr from "lodash.deburr";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { insertParcelle, updateParcelle } from "../api/parcelle";
import { BUCKET_IMAGE, storeFile } from "../api/storage";
import { MessageSnackbar } from "../components/Snackbar";
import { FileUploadInput } from "../components/input/FileUploadInput";
import { Parcelle, ParcelleInsert, ParcelleUpdate } from "../model/Parcelle";
import { Site } from "../model/Site";
import { getAllSite } from "../api/site";

interface Props {
  onValid: () => void;
  editValue: null | Parcelle;
}
export const ParcelleForm = ({ onValid, editValue }: Props) => {
  const [sites, setSites] = useState<Array<Site>>([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  const getSites = async () => {
    const { data } = await getAllSite();
    setSites(data as Array<Site>);
  };

  useEffect(() => {
    getSites();
  }, []);

  const initialValue: {
    nom: string;
    surface: number;
    prix: number;
    image: null | File | string;
    site: null | number;
  } = editValue
    ? {
        nom: editValue.nom,
        surface: editValue.surface,
        prix: editValue.prix,
        image: editValue.image,
        site: editValue.site.id,
      }
    : {
        nom: "",
        surface: 0,
        prix: 0,
        image: null,
        site: null,
      };

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Veuillez renseigner un nom"),
    surface: Yup.number().required("Veuillez renseigner une surface"),
    site: Yup.number().required("Veuillez renseigner un site").nonNullable(),
    prix: Yup.string().required("Veuillez renseigner un prix"),
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
        if (values.site !== null) {
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
            const parcelleUpdate: ParcelleUpdate = {
              image: file,
              id: editValue.id,
              nom: values.nom,
              prix: values.prix,
              surface: values.surface,
              site: values.site,
            };
            const { error } = await updateParcelle(parcelleUpdate);
            if (error === null) {
              setSeverity("success");
              setMessage("Votre ajout a été pris en compte");
              onValid();
            } else {
              getSnackbarError();
            }
          } else {
            let file = null;
            if (values.image !== null) {
              const image = values.image as unknown as File;
              file = await uploadFile(BUCKET_IMAGE, deburr(image.name), image);
            }
            const parcelleInsert: ParcelleInsert = {
              image: file !== null ? file.path : file,
              nom: values.nom,
              prix: values.prix,
              surface: values.surface,
              site: values.site,
            };
            const { error } = await insertParcelle(parcelleInsert);
            if (error === null) {
              setSeverity("success");
              setMessage("Votre ajout a été pris en compte");
              onValid();
            } else {
              getSnackbarError();
            }
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
            error={Boolean(formik.touched.site && formik.errors.site)}
          >
            <InputLabel id="site-input">Site</InputLabel>
            <Select
              labelId="site-input"
              id="site-input"
              value={formik.values.site}
              label="Site"
              onChange={(event: SelectChangeEvent) =>
                formik.setFieldValue("site", Number(event.target.value))
              }
            >
              {sites.map((site) => (
                <MenuItem value={site.id}>
                  {site.nom} - {site.adresse.ville}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
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
            error={Boolean(formik.touched.surface && formik.errors.surface)}
          >
            <InputLabel htmlFor="surface-input">Surface</InputLabel>
            <OutlinedInput
              id="surface-input"
              type="number"
              value={formik.values.surface}
              name="surface"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Surface"
              inputProps={{}}
            />
            {formik.touched.surface && formik.errors.surface && (
              <FormHelperText error id="error-surface">
                {formik.errors.surface}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.prix && formik.errors.prix)}
          >
            <InputLabel htmlFor="prix-input">Prix</InputLabel>
            <OutlinedInput
              id="prix-input"
              type="number"
              value={formik.values.prix}
              name="prix"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Prix"
              inputProps={{}}
            />
            {formik.touched.prix && formik.errors.prix && (
              <FormHelperText error id="error-prix">
                {formik.errors.prix}
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
