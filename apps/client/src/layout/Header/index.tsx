import { Button, Modal, PageHeader } from "antd";
import React, { useCallback } from "react";
import classes from "./header.module.css";
import { useHeader } from "./useHeader";

const Header = () => {
  const { redis, toggleShowRedisInfo } = useHeader();

  console.log("redis", redis);

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
      });
    }
  }, [redis]);

  return (
    <React.Fragment>
      <PageHeader
        title="Bull Monitor"
        extra={[
          <Button shape="round" type="primary" onClick={showRedisInfo}>
            Redis info
          </Button>,
        ]}
      ></PageHeader>
    </React.Fragment>
  );
};

export default Header;
