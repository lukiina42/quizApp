import React from "react";
import { UserStatus, useUser } from "../context/UserContext";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute(props) {
  const { component: Component, isReverse, ...restProps } = props;
  const userLogged = useUser().status === UserStatus.Logged;

  return (
    <Route
      {...restProps}
      render={(restProps) =>
        isReverse ? (
          userLogged ? (
            <Redirect to="/" />
          ) : (
            <Component {...restProps} />
          )
        ) : userLogged ? (
          <Component {...restProps} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}
