import React, { useEffect } from "react";

const Connected = () => {
  // check if user has mint his SBT

  useEffect(() => {
    console.log("You are now connected!");
  }, []);

  return <div>Connected</div>;
};

export default Connected;
