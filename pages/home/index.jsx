import { useState, useEffect } from "react";
import Head from "next/head";
import { withRouter, useRouter } from "next/router";
import UIText from "../../components/LocalizedText";
import Header from "../../components/Header";
import version from "../../components/version-info";
import {
  collection,
  orderBy,
  query,
  onAuthStateChanged,
  where,
  getFirestore,
  doc,
  onSnapshot,
  auth,
  limit,
  getDoc,
} from "../../components/firebase";
import Spinner from "../../components/LoadingSpinner";
import FeatherIcon from "feather-icons-react";
import { ToastContainer, toast } from "react-toastify";

const ChatItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dm, setDm] = useState(false);
  const [otherUser, setOtherUser] = useState({});

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `privateChats/${id}`, "messages"),
        orderBy("timestamp", "desc"),
        limit(1)
      ),
      (snapshot) => {
        setChatMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        getDoc(doc(db, `privateChats/${id}`)).then((chat) => {
          setDm(chat.data().dm);

          if (chat.data().dm) {
            const otherUserId = chat
              .data()
              .members.filter((user) => user !== auth.currentUser.uid)[0];

            getDoc(doc(db, `users/${otherUserId}`)).then((user) => {
              setOtherUser(user.data());
              // console.log(user.data());
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        });
      }
    );
    return () => unsubscribe();
  }, [id, db]);

  return (
    <div
      onClick={() => enterChat(id, chatName ? chatName : otherUser.name)}
      key={id}
      style={{
        width: "100%",
        height: 20,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#f4f5f5",
      }}
    ></div>
  );
};

const Home = (props) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [noChats, setNoChats] = useState("");
  const [requests, setRequests] = useState([]);

  const router = useRouter();

  useEffect(() => {
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
        setRequests(snapshot.data()?.friendRequests);
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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        // closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          zIndex: "10001",
        }}
        bodyClassName="toast-container"
      />
      <Head>
        <title>sendr</title>
      </Head>
      <div
        style={{
          backgroundColor: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
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
                width: 100,
              }}
            >
              <p
                style={{
                  color: "#727178",
                  fontFamily: "monospace",
                  mixBlendMode: "difference",
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
                justifyContent: "space-evenly",
                // alignSelf: "flex-end",
                width: 100,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: "#f4f5f5",
                  cursor: "pointer",
                  marginBottom: -10,
                  marginRight: 50,
                  width: 20,
                  mixBlendMode: "difference",
                }}
                onClick={() => toast.warn("not yet implemented")}
                // onMouseEnter={() => setDisplayFriends(true)}
                // onMouseLeave={() => setDisplayFriends(false)}
              >
                <FeatherIcon icon="users" size={20} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: "#f4f5f5",
                  cursor: "pointer",
                  marginBottom: -10,
                  width: 20,
                  mixBlendMode: "difference",
                }}
                onClick={() => toast.warn("not yet implemented")}
                // onMouseEnter={() => setDisplaySettings(true)}
                // onMouseLeave={() => setDisplaySettings(false)}
              >
                <FeatherIcon icon="settings" size={20} />
              </div>
            </div>
          }
          hideArrow
        />
        {chats.map((chat, index) => (
          <ChatItem
            key={index}
            id={chat.id}
            chatName={chat.chatName}
            enterChat={() => {
              toast("insert chat entry here");
            }}
          />
        ))}
      </div>
    </>
  );
};

export default withRouter(Home);
