import classes from "./home.module.css";

const Home = () => {
  return (
    <div className={classes.root}>
      <h1>Welcome to the Bull Monitor Dashboard!</h1>

      <h2>
        Try adding redis connection or click on connection on the right side to
        view queues on that redis connection
      </h2>
    </div>
  );
};

export default Home;
