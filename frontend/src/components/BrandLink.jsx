import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function BrandLink(props) {
  const { user } = useAuth();
  const destination = user ? "/dashboard" : "/";

  return (
    <Link to={destination} className={props.className}>
      <Logo size={props.size} showText={props.showText} />
    </Link>
  );
}

export default BrandLink;
