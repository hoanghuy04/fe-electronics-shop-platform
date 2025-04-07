import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "../routes";

export default function AllRoutes() {
  const elements = useRoutes(routes);

  return <div>{elements}</div>;
}
