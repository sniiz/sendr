import { useState, useEffect } from "react";
import Head from "next/head";
import { withRouter, useRouter } from "next/router";
import UIText from "../../components/LocalizedText";
import Header from "../../components/Header";
import version from "../../components/version-info";
import {
  // getAuth,
  collection,
  orderBy,
  query,
  onAuthStateChanged,
  where,
  getFirestore,
  doc,
  onSnapshot,
  auth,
} from "../../components/firebase";
import Spinner from "../../components/LoadingSpinner";
import FeatherIcon from "feather-icons-react";

const Home = (props) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [noChats, setNoChats] = useState("");
  const [requests, setRequests] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // const auth = getAuth();
    const db = getFirestore();
    if (!auth?.currentUser?.uid) {
      router.push("/");
      return;
    }
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else if (!user?.emailVerified) {
        router.push("/verifyEmail");
      }
    });
    setNoChats(UIText.homeScreen[`lonely${Math.floor(Math.random() * 6) + 1}`]);
    const unsubscribe = onSnapshot(
      query(
        collection(db, "privateChats"),
        // orderBy("lastMessage", "desc"),
        orderBy("chatName", "desc"),
        where("members", "array-contains", auth.currentUser.uid)
      ),
      (snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.chatName,
            author: doc.author,
            ...doc.data(),
          }))
        );
        if (loading) {
          setLoading(false);
        }
      },
      (error) => {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    );
    const unsubscribeRequests = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (snapshot) => {
        console.log(snapshot);
        setRequests(snapshot.data().friendRequests);
      }
    );
    return () => {
      unsubscribe();
      unsubscribeRequests();
      unsubAuth();
    };
  }, [loading, router]);
  return (
    <>
      <Head>
        <title>sendr</title>
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
          title="sendr"
          left={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // alignSelf: "flex-start",
                justifySelf: "left",
              }}
            >
              <p
                style={{
                  color: "#f4f5f5",
                }}
              >
                {version.number}
              </p>
            </div>
          }
          right={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // alignSelf: "flex-end",
              }}
            >
               <p
                style={{
                  color: "#00000000",
                }}
              >
                {version.number}
              </p>
            </div>
          }
          hideArrow
        />
      </div>
    </>
  );
};

export default withRouter(Home);
