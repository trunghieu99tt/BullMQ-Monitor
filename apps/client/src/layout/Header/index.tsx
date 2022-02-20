import React from "react";
import classes from "./header.module.css";
import { useHeader } from "./useHeader";

const Header = () => {
  const { redis, showRedisInfo, toggleShowRedisInfo } = useHeader();

  console.log("redis", redis);

  return (
    <React.Fragment>
      {showRedisInfo && redis && (
        <section className={classes.redis}>
          {Object.entries(redis).map(([key, value]) => (
            <li>
              {key}: {value}
            </li>
          ))}
        </section>
      )}
      <header className={classes.root}>
        <h1 className={classes.heading}>Bull Monitor</h1>
        <div className={classes.right}>
          <button onClick={toggleShowRedisInfo}>Redis info</button>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
