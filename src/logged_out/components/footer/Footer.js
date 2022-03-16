import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Hidden,
  TextField,
} from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import WaveBorder from "../../../shared/components/WaveBorder";
import ColoredButton from "../../../shared/components/ColoredButton";
import useMediaQuery from "@mui/material/useMediaQuery";

const styles = (theme) => ({
  footerInner: {
    backgroundColor: theme.palette.common.darkBlack,
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(16),
      paddingRight: theme.spacing(16),
      paddingBottom: theme.spacing(10),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  footerLinks: {
    marginTop: theme.spacing(2.5),
    marginBot: theme.spacing(1.5),
    color: theme.palette.common.white,
  },
  infoIcon: {
    color: `${theme.palette.common.white} !important`,
    backgroundColor: "#33383b !important",
  },
  socialIcon: {
    fill: theme.palette.common.white,
    backgroundColor: "#33383b",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  link: {
    cursor: "Pointer",
    color: theme.palette.common.white,
    transition: theme.transitions.create(["color"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeIn,
    }),
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  whiteBg: {
    backgroundColor: theme.palette.common.white,
  },
});

const infos = [
  {
    icon: <MailIcon />,
    description: "pumasemj@hotmail.com",
  },
];

const socialIcons = [

  {
    icon: (
      <svg
        role="img"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Facebook</title>
        <path d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z" />
      </svg>
    ),
    label: "Facebook",
    href: "https://facebook.com",
  },
];

function Footer(props) {
  const { classes, theme } = props;
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <footer className="lg-p-top">
      <WaveBorder
        upperColor="#FFFFFF"
        lowerColor={theme.palette.common.darkBlack}
        animationNegativeDelay={4}
      />
      <div className={classes.footerInner}>
        <Grid container spacing={isWidthUpMd ? 10 : 5}>
          <Hidden lgDown>
            <Grid item xs={12} md={6} lg={4}>
              <Box display="flex" justifyContent="center">
                <div>
                  {infos.map((info, index) => (
                    <Box display="flex" mb={1} key={index}>
                      <Box mr={2}>
                        <IconButton
                          className={classes.infoIcon}
                          tabIndex={-1}
                          disabled
                          size="large"
                        >
                          {info.icon}
                        </IconButton>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <Typography variant="h6" className="text-white">
                          {info.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </div>
              </Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" paragraph className="text-white">
              Buscador del libro de Cielo de Luisa Picarreta
            </Typography>
            <Typography style={{ color: "#8f9296" }} paragraph>
              Se puede buscar por una palabra o por una frase
            </Typography>
            <Box display="flex">
              {socialIcons.map((socialIcon, index) => (
                <Box key={index} mr={index !== socialIcons.length - 1 ? 1 : 0}>
                  <IconButton
                    aria-label={socialIcon.label}
                    className={classes.socialIcon}
                    href={socialIcon.href}
                    size="large"
                  >
                    {socialIcon.icon}
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <form>
              { false && <Box display="flex" flexDirection="column">
                <Box mb={1}>
                  <TextField
                    variant="outlined"
                    multiline
                    placeholder="Get in touch with us"
                    InputProps={{
                      className: classes.whiteBg,
                      "aria-label": "Get in Touch",
                    }}
                    rows={4}
                    fullWidth
                    required
                  />
                </Box>
                <ColoredButton
                  color={theme.palette.common.white}
                  variant="outlined"
                  type="submit"
                >
                  Send Message
                </ColoredButton>
              </Box> }
            </form>
          </Grid>
        </Grid>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Footer);
