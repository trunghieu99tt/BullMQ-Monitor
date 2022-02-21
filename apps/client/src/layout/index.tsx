import React from "react";
import Header from "./Header";

import { Layout } from "antd";
import Sidebar from "./Sidebar";

const { Content } = Layout;

const withLayout =
  <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <React.Fragment>
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Header />
          <Layout>
            <Sidebar />
            <Content>
              <WrappedComponent {...props} />
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    );
  };

export default withLayout;
