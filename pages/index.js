import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../config.json";

function Titulo(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

// Componente React
// function HomePage() {
//     // JSX
//     return (
//         <div>
//             <GlobalStyle />
//             <Titulo tag="h2">Boas vindas de volta!</Titulo>
//             <h2>Discord - Alura Matrix</h2>
//         </div>
//     )
// }
// export default HomePage

export default function PaginaInicial() {
  // const username = 'mvnulman';
  const [username, setUsername] = useState("");
  const [githubInfo, setGithubInfo] = useState([]);
  const router = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            "url(https://virtualbackgrounds.site/wp-content/uploads/2020/12/vintage-computers-collection.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            height: { xs: "570px", sm: "400px"},
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
            opacity: 0.98,
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              if (username.trim() == "") {
                alert("Please enter a username!");
                return;
              } else {
                router.push(`/chat?username=${username}`);
              }
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Titulo tag="h2">Welcome back!</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            {/* <input 
            type="text" 
            value={username}
            onChange={function(event){
              const inputField = event.target.value
              setUsername(inputField)
            }}/> */}

            <TextField
              placeholder="Type the username..."
              value={username}
              onChange={function (event) {
                const inputField = event.target.value;
                setUsername(inputField);
                fetch(`https://api.github.com/users/${inputField}`)
                  .then((response) => response.json())
                  .then((data) => {
                    setGithubInfo(data);
                  });
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type="submit"
              label="Let's Chat"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.neutrals[900],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[900],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              height: { xs: "310px", sm: "325px"},
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              // minHeight: "315px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={
                username.length > 0 &&
                username.length !== null &&
                username.trim()
                  ? `https://github.com/${username}.png`
                  : `https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1024px-Missing_avatar.svg.png`
              }
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username.length > 0 &&
              username.length !== null &&
              username.trim()
                ? username
                : "No Username"}
            </Text>
            <Text
              variant="body4"
              styleSheet={{
                margin: "5px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              Name: {githubInfo.name}
            </Text>
            <Text
              variant="body4"
              styleSheet={{
                margin: "5px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              Location: {githubInfo.location}
            </Text>
            <Text
              variant="body4"
              styleSheet={{
                margin: "5px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              Followers: {githubInfo.followers}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
