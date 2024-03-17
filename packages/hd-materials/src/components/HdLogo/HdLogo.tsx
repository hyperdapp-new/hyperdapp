import React, { FC } from "react";
import { HdLogoProps } from "./HdLogo.types";
// @ts-ignore
import logoWhite from "../../images/hd-logo-white.png";
// @ts-ignore
import logoBlue from "../../images/hd-logo-blue.png";

const HdLogo: FC<HdLogoProps> = ({
  color = "white",
  isClickable = false,
  onClick = () => null,
}) => {
  const logo = color === "white" ? logoWhite : logoBlue;

  return (
    <img
      className={isClickable ? "cursor-pointer" : ""}
      src={logo}
      onClick={onClick}
      width="170"
      height="70"
      alt="hd-logo"
    />
  );
};

export default HdLogo;
