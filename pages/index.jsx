import { useState, useEffect } from "react";
import Head from "next/head";
import { withRouter, Router } from "next/router";
import UIText from "../components/LocalizedText";
import Header from "../components/Header";
import version from "../components/version-info";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  getFirestore,
  setDoc,
  getDoc,
  doc,
} from "../components/firebase";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [takingTooLong, setTakingTooLong] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useState(() => {
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      if (user !== null) {
        // console.log(user);
        getDoc(doc(db, `users`, user.uid)).then(
          async (userdoc) => {
            if (!userdoc?.exists()) {
              await setDoc(doc(db, "users", user.uid), {
                friendRequests: [],
                friends: [],
                name: user.displayName,
                pfp: user.photoURL ? user.photoURL : null,
                online: true,
                status: "",
                notifsKey: "",
              }).catch((e) => {
                alert(e);
                // navigation.replace("home");
              });
              // navigation.replace("home");
            } else {
              // navigation.replace("home");
            }
          },
          (error) => {
            alert(error);
            // navigation.replace("home");
          }
        );
      } else {
        setLoading(false);
      }
    });
    const tooLong = setTimeout(() => {
      setTakingTooLong(true);
    }, 10000);
    return () => {
      unsub();
      clearTimeout(tooLong);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{UIText.loginScreen.barTitle}</title>
      </Head>
      <div
        style={{
          backgroundColor: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          overflowY: "scroll",
          flexDirection: "column",
          // overflowX: "hidden",
        }}
      >
        <Header
          router={props.router}
          title={UIText.loginScreen.barTitle}
          hideArrow
        />
        <p
          style={{
            color: "#727178",
            fontFamily: "monospace",
            fontStyle: "italic",
            marginBottom: "20px",
            fontSize: "12px",
            textAlign: "center",
            whiteSpace: "pre-wrap",
          }}
        >
          v{version.number}
          {"\n"}build {version.build}
          {"\n"}✨ {version.name} ✨
        </p>
        <h1
          style={{
            fontWeight: "800",
            fontSize: "40px",
            color: "#f4f5f5",
          }}
        >
          sendr.
        </h1>
        <input
          type="email"
          placeholder={UIText.loginScreen.emailPlaceholder}
          autoComplete={false}
          spellCheck={false}
          style={{}}
        ></input>
      </div>
    </>
  );
};

export default withRouter(Login);
