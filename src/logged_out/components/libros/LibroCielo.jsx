import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import HeadSection from "../home/HeadSection";
import FeatureSection from "../home/FeatureSection";

var __html = require('./index.html');
var template = { __html: __html };
function LibroCielo(props) {
    console.log("Aqui paps");
  return (
    <Fragment>
       <div dangerouslySetInnerHTML={template} />  
    </Fragment>
  );
}


export default LibroCielo;
