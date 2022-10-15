import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { withRouter, useRouter } from "next/router";
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
import Spinner from "../components/LoadingSpinner";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import "../styles/Login.module.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordCorrect, setPasswordCorrect] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [takingTooLong, setTakingTooLong] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const router = useRouter();

  const handleLogin = async () => {
    // setLoggingIn(true);
    // setPasswordCorrect(true);
    // setEmail(email.trim());
    // setPassword(password.trim());
    // signInWithEmailAndPassword(auth, email, password)
    //   .then(() => {
    //     setLoggingIn(false);
    //     router.replace("/home");
    //   })
    //   .catch((error) => {
    //     setLoggingIn(false);
    //     // if (error.message.includes("password")) {
    //     //   setPasswordCorrect(false);
    //     // } else alert(error);
    //     alert(error);
    //   });
    alert("this is just a demo");
  };

  const handleSignUp = () => {
    alert("this is just a demo");
  };

  // const particlesInit = useCallback(async (engine) => {
  //   console.log(engine);
  //   await loadFull(engine);
  // }, []);

  // const particlesLoaded = useCallback(async (container) => {
  //   await console.log(container);
  // }, []);

  useState(() => {
    // router.prefetch("/home");
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
                router.replace("/home");
              });
              router.replace("/home");
            } else {
              router.replace("/home");
            }
          },
          (error) => {
            alert(error);
            router.replace("/home");
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

  if (loading || !particlesLoaded)
    return (
      <>
        <Head>
          <title>{`${UIText.loginScreen.barTitle} | sendr`}</title>
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
          <Spinner size="20px" color="#f4f5f5" />
        </div>
      </>
    );
  return (
    <>
      <Head>
        <title>{`${UIText.loginScreen.barTitle} | sendr`}</title>
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
        {/* <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          style={{
            zIndex: "99",
          }}
          options={{
            particles: {
              number: {
                value: 50,
                density: {
                  enable: false,
                },
              },
              size: {
                value: 3,
                random: true,
                animation: {
                  speed: 10,
                  decay: 10,
                },
              },
              color: {
                value: "#f4f5f5",
                animation: {
                  speed: 1,
                  l: 0,
                },
              },
              line_linked: {
                enable: false,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: "bounce",
                random: true,
                speed: 1,
                straight: true,
              },
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: "bubble",
                },
              },
              modes: {
                bubble: {
                  distance: 250,
                  duration: 1,
                  size: 6,
                },
                repulse: {
                  distance: 100,
                  duration: 1000,
                },
              },
            },
          }}
        /> */}
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
            marginBottom: "-20px",
            fontSize: "10px",
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
            fontWeight: "700",
            fontSize: "45px",
            color: "#f4f5f5",
          }}
        >
          sendr.
        </h1>
        <input
          type="email"
          placeholder={UIText.loginScreen.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            background: "rgba(10, 10, 11, 0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            marginBottom: "10px",
            marginTop: "-20px",
            fontWeight: "bold",
            fontSize: "20px",
            padding: "13px",
            width: "320px",
            // backgroundColor: "#0a0a0b",
            border: "2px solid #f4f5f5",
            zIndex: "1000",
            // width: "30vw",
            // color,
            "&:placeholder": {
              color: "#727178",
            },
          }}
        />
        <input
          type="password"
          placeholder={UIText.loginScreen.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onSubmit={(event) => alert("ye")}
          style={{
            background: "rgba(10, 10, 11, 0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            marginBottom: "10px",
            // marginTop: "-10px",
            fontWeight: "bold",
            fontSize: "20px",
            padding: "13px",
            width: "320px",
            // backgroundColor: "#0a0a0b",
            border: "2px solid #f4f5f5",
            zIndex: "1000",
            // width: "30vw",
            // color,
            "&:placeholder": {
              color: "#727178",
            },
          }}
        />
        {loggingIn ? (
          <Spinner
            size="25px"
            color="#f4f5f5"
            style={{
              marginBottom: "39px",
            }}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#f4f5f5",
              paddingLeft: "28px",
              paddingRight: "28px",
              paddingTop: "12px",
              paddingBottom: "12px",
              fontWeight: "900",
              color: "#0a0a0b",
              fontSize: "25px",
              borderRadius: "10px",
              marginTop: "10px",
              cursor: "pointer",
              zIndex: "1000",
            }}
            onClick={handleLogin}
          >
            {UIText.loginScreen.loginButton}
          </div>
        )}
        <div
          style={{
            // backgroundColor: "#0a0a0b",
            // textDecorationLine: "underline",
            background: "rgba(10, 10, 11, 0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "13px",
            paddingBottom: "13px",
            fontWeight: "700",
            color: "#f4f5f5",
            fontSize: "20px",
            borderRadius: "10px",
            marginTop: "10px",
            cursor: "pointer",
            zIndex: "1000",
            border: "2px solid #f4f5f5",
          }}
          onClick={handleSignUp}
        >
          {UIText.loginScreen.signUpButton}
        </div>
      </div>
    </>
  );
};

export default withRouter(Login);
