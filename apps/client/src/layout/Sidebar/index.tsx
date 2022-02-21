import { PlusOutlined } from "@ant-design/icons";
import { Layout, Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AddConnectionForm from "../../components/AddConnectionForm";
import { connectionListState } from "../../states/connection.state";
import { IConnection } from "../../types/model.type";
import { getParams } from "../../utils/url";

import classes from "./sidebar.module.css";

const { Sider } = Layout;

const Sidebar = () => {
  const { pathname } = window.location;

  const [showAddConnectionForm, setShowAddConnectionForm] =
    useState<boolean>(false);
  const connections = useRecoilValue(connectionListState);

  const handleAddConnectionForm = () => {
    setShowAddConnectionForm(true);
  };

  const handleCloseAddConnectionForm = () => {
    setShowAddConnectionForm(false);
  };

  useEffect(() => {
    const params = getParams(pathname);
    console.log("params", params);
  }, [pathname]);

  return (
    <React.Fragment>
      <Modal
        visible={showAddConnectionForm}
        footer={false}
        maskClosable={true}
        closeIcon={false}
      >
        <AddConnectionForm onCancel={handleCloseAddConnectionForm} />
      </Modal>
      <Sider
        width={"20%"}
        style={{
          background: "#fff",
        }}
      >
        <div className={classes.header}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            shape="circle"
            onClick={handleAddConnectionForm}
          ></Button>
        </div>
        <ul className={classes.connectionList}>
          {connections.map((connection: IConnection) => {
            return (
              <li className={classes.connectionItem} key={connection.id}>
                <Link to={`/connection/${connection.id}`}>
                  {connection.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </Sider>
    </React.Fragment>
  );
};

export default Sidebar;
