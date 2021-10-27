import React from "react";
import "../Infobox.css";
import { Card, CardContent, Typography } from "@mui/material";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
  return (
    <div>
      <Card
        onClick={props.onClick}
        className={`InfoBox ${active && "infobox--selected"} ${
          isRed && "infobox--red"
        }`}
      >
        <CardContent>
          {/* Corona virus cases */}
          <Typography className="infoBox__title" color="textSecondary">
            {title}
          </Typography>
          {/* Number of cases */}
          <h2
            className={`infoBox__cases ${!isRed && "infobox__cases--green"} `}
          >
            {cases}
          </h2>
          {/* no of deaths */}
          <Typography className="infoBox__total" color="textSecondary">
            {total} Total
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBox;
