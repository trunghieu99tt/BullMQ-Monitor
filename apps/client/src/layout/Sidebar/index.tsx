import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { Layout, Button, Modal } from "antd";

// components
import AddConnectionForm from "../../components/AddConnectionForm";

// states
import { connectionListState } from "../../states/connection.state";

// icons
import { PlusOutlined } from "@ant-design/icons";

// types
import { IConnection } from "../../types/model.type";

// styles
import classes from "./sidebar.module.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [showAddConnectionForm, setShowAddConnectionForm] =
    useState<boolean>(false);
  const connections = useRecoilValue(connectionListState);

  const handleAddConnectionForm = () => {
    setShowAddConnectionForm(true);
  };

  const handleCloseAddConnectionForm = () => {
    setShowAddConnectionForm(false);
  };

  return (
    <React.Fragment>
      <Modal
        visible={showAddConnectionForm}
        footer={false}
        maskClosable={true}
        closeIcon={false}
        onCancel={handleCloseAddConnectionForm}
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
