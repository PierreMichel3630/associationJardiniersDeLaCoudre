import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { MessageSnackbar } from "../components/Snackbar";
import { useAuth } from "../context/AuthProviderSupabase";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [errorLogin, setErrorLogin] = useState("");

  const initialValue = {
    email: "",
    password: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Veuillez saisir une adresse mail valide")
      .max(255)
      .required("Veuillez saisir une adresse mail"),
    password: Yup.string().max(255).required("Veuillez saisir un mot de passe"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const {
          data: { user, session },
          error,
        } = await login(values.email, values.password);
        if (error) {
          if (error.message === "Invalid login credentials") {
            setErrorLogin("L'adresse email ou le mot de passe est erroné");
          } else {
            setErrorLogin("Oups une erreur est survenue. Veuillez ressayer");
          }
        }
        if (user && session) navigate("/");
      } catch (err) {
        setErrorLogin("Oups une erreur est survenue. Veuillez ressayer");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.email && formik.errors.email)}
          >
            <InputLabel htmlFor="login-email-input">Adresse email</InputLabel>
            <OutlinedInput
              id="login-email-input"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Adresse email"
              inputProps={{}}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error id="login-error-email">
                {formik.errors.email}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel htmlFor="login-password-input">
              {"Mot de passe"}
            </InputLabel>
            <OutlinedInput
              id="login-password-input"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mot de passe"
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error id="login-error-password">
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            Se connecter
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={errorLogin !== ""}
        handleClose={() => setErrorLogin("")}
        message={errorLogin}
      />
    </form>
  );
};
