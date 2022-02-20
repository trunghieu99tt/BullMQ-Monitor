import React from "react";
import Header from "./Header";

const withLayout =
  <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <React.Fragment>
        <Header />
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };

export default withLayout;
