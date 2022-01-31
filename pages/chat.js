import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { useEffect, useState } from "react";
import appConfig from "../config.json";
import { IoClose } from "react-icons/io5";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU1NTk4MSwiZXhwIjoxOTU5MTMxOTgxfQ.J_mM8RYx7SQ5AI7irXM56A_lRBjS8S6gW6LVQL2t6qU";
const SUPABASE_URL = "https://oxqgkykaxurntguobfbe.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listenMessagesRealTime = () => {
  return supabaseClient
  .from('messages')
  .on("INSERT", () => {
    console.log("New message!")
  })
  .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const logedUser = router.query.username;
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([
    // {
    //   id: 1,
    //   from: "mvnulman",
    //   text: ":sticker: https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_3.png",
    // },
  ]);

  useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        // console.log("Request data info:", data);
        setMessageList(data);
      });

      const subscription = listenMessagesRealTime ((newMessage) => {
        console.log('New message:', newMessage);
        console.log('Message list:', messageList);

        setMessageList((actualListValue) => {
          console.log('Actual list value:', actualListValue);
          return [
            newMessage,
            ...actualListValue,
          ]
        });
      });

      return () => {
        subscription.unsubscribe();
      };
  }, []);

  function handleNewMessage(newMessage) {
    const message = {
      // id: messageList.length + 1,
      from: logedUser,
      text: newMessage,
    };

    supabaseClient
      .from("messages")
      .insert([message])
      .then(({ data }) => {
        console.log("Criando mensagem", data);
        setMessageList([data[0], ...messageList]);
      });

    setMessage("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/12/vintage-computers-collection.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMofrom: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            messages={messageList}
            onDelete={(id) => {
              setMessageList(
                messageList.filter((element) => {
                  return element.id !== id;
                })
              );
            }}
          />

          {/* {messageList.map((messageAtual) => {
                        return (
                            <li key={messageAtual.id}>
                                {messageAtual.de}: {messageAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const valor = event.target.value;
                setMessage(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insert your message here..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker 
              onStickerClick={(sticker) => {
                handleNewMessage(`:sticker: ${sticker}`);

              }}
            />
            <Button
              type="button"
              label="Send"
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[900],
                mainColorLight: appConfig.theme.colors.primary[900],
                mainColorStrong: appConfig.theme.colors.primary[900],
              }}
              styleSheet={{
                marginBottom: "10px",
                marginLeft: "10px",
                width: "60px",
                height: "55px",
                borderRadius: "10px",
                backgroundColor: appConfig.theme.colors.neutrals[900],
              }}
              onClick={() => {
                if (message.length >= 1) {
                  handleNewMessage(message);
                  document.querySelector("textarea").focus();
                }
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                styleSheet={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${message.from}.png`}
                />
                <Text tag="strong">{message.from}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>

              <IoClose
                style={{
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                }}
                onClick={() => {
                  props.onDelete(message.id);
                }}
              />
            </Box>
            {message.text.startsWith(":sticker:") ? (
              <Image src={message.text.replace(":sticker:", "")} />
            ) : (
              message.text
            )}
          </Text>
        );
      })}
    </Box>
  );
}
