import { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import UIText from "../components/LocalizedText";

const Login = () => {
  return (
    <>
      <Head>
        <title>{UIText.loginScreen.barTitle}</title>
      </Head>
      <div className="container"></div>
    </>
  );
};

export default Login;
