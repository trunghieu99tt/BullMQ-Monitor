import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import React, { useCallback } from "react";
import { Button, Modal, PageHeader } from "antd";

// talons
import { redisState } from "../../states/redis.state";

const Header = () => {
  const redis = useRecoilValue(redisState);

  const showRedisInfo = useCallback(() => {
    if (redis) {
      Modal.info({
        title: "Redis Info",
        content: (
          <section>
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
