import { Button, Modal, PageHeader } from "antd";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import classes from "./header.module.css";
import { useHeader } from "./useHeader";

const Header = () => {
  const { redis } = useHeader();

  const showRedisInfo = useCallback(() => {
    if (redis) {
      Modal.info({
        title: "Redis Info",
        content: (
          <section className={classes.redis}>
            {Object.entries(redis).map(([key, value]) => (
              <li>
                {key}: {value}
              </li>
            ))}
          </section>
        ),
        maskClosable: true,
      });
    }
  }, [redis]);

  return (
    <React.Fragment>
      <PageHeader
        title={<Link to="/">Bull Monitor</Link>}
        extra={
          redis && [
            <Button shape="round" type="primary" onClick={showRedisInfo}>
              Redis info
            </Button>,
          ]
        }
      ></PageHeader>
    </React.Fragment>
  );
};

export default Header;
