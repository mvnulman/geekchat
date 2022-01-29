import React from "react";
import { Image } from "@skynexui/components";


const page404 = () => {
  return (
    <>
      <Image
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "url(https://stories.freepiklabs.com/storage/26832/oops-404-error-with-a-broken-robot-rafiki-2849.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      ></Image>
    </>
  );
};

export default page404;
