import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const LandingPage = () => {
  let params = useParams();
  const [mode, setMode] = useState(null);
  const [playerFirst, setPlayerFirst] = useState(null);
  const [playerSecond, setPlayerSecond] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [iscopied, setIscopied] = useState({
    copyId: false,
    copyLink: false,
  });
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigate();

  const onhandleCreateRoom = async () => {
    try {
      const output = await axios.post(
        `https://real-time-tic-toe-game.onrender.com/api/roomCreate`,
        { playerFirst }
      );

      const room = output.data.data.roomId;
      setRoomId(room);
      localStorage.setItem("roomId", room);
      localStorage.setItem("firstplayer", output.data.data.firstPlayer);
      setShowPopup(true);

      // Auto close after 10 seconds
      setTimeout(() => {
        setShowPopup(false);
        navigation(`/gamepage`);
      }, 10000);
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigation(`/gamepage`);
  };

  const onhandleidcopied = (copything, copyitem) => {
    navigator.clipboard.writeText(copyitem);
    setIscopied((pre)=>({ ...pre, [copything]: true }));

    setTimeout(() => {
      setIscopied((pre)=>({ ...pre, [copything]: false }));
    }, 2000);
  };

  const onhandleJoinRoom = async () => {
    try {
      const output = await axios.post(
        `https://real-time-tic-toe-game.onrender.com/api/joinRoom`,
        {
          playerSecond,
          roomId,
        }
      );
      alert(output.data.msg);
      localStorage.setItem("secondPlayer", playerSecond);
      localStorage.setItem("roomId", roomId);
      navigation(`/gamepage`);
    } catch (error) {
      alert("something went wrong");
    }
  };

  useEffect(() => {
    if (params.roomId) {
      setRoomId(params.roomId);
      setMode("join");
    }
  }, []);

  return (
    <Container>
      <Card>
        <Title>Tic-Tac-Toe Online (1vs1)</Title>
        <ButtonContainer>
          <Button onClick={() => setMode("create")} active={mode === "create"}>
            Create Room
          </Button>
          <Button onClick={() => setMode("join")} active={mode === "join"}>
            Join Room
          </Button>
        </ButtonContainer>

        {mode === "create" && (
          <Form>
            <Input
              value={playerFirst}
              type="text"
              placeholder="Enter Your Name"
              onChange={(e) => setPlayerFirst(e.target.value)}
            />
            <SubmitButton onClick={onhandleCreateRoom}>
              Create Room
            </SubmitButton>
          </Form>
        )}

        {mode === "join" && (
          <Form>
            <Input
              type="text"
              value={playerSecond}
              placeholder="Enter Your Name"
              onChange={(e) => setPlayerSecond(e.target.value)}
            />
            <Input
              type="text"
              value={roomId}
              placeholder="Enter Room ID"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <SubmitButton onClick={onhandleJoinRoom}>Join Room</SubmitButton>
          </Form>
        )}
      </Card>

      {showPopup && (
        <PopupOverlay>
          <PopupCard>
            <h3>Room Created Successfully!</h3>
            <p>Share this Room ID or Link with your friend:</p>

            <RoomIdBox>
              <RoomIdText>{roomId}</RoomIdText>
              <CopyButton onClick={() => onhandleidcopied("copyId", roomId)}>
                {iscopied.copyId ? "Copied" : "Copy"}
              </CopyButton>
            </RoomIdBox>

            <RoomIdBox>
              <RoomIdText>{`https://real-time-tic-toe-game.onrender.com/${roomId}`}</RoomIdText>
              <CopyButton
                onClick={() =>
                  onhandleidcopied(
                    "copyLink",
                    `https://real-time-tic-toe-game.onrender.com/${roomId}`
                  )
                }
              >
                {iscopied.copyLink ? "Copied" : "Copy Link"}
              </CopyButton>
            </RoomIdBox>

            <CloseButton onClick={handleClosePopup}>Close</CloseButton>
            <p style={{ marginTop: "8px", fontSize: "0.8rem", color: "#aaa" }}>
              This will auto-close in 10 seconds
            </p>
          </PopupCard>
        </PopupOverlay>
      )}
    </Container>
  );
};

export default LandingPage;

// 🔹 Styled Components

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #121212;
  color: white;
`;

const Card = styled.div`
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: ${(props) => (props.active ? "#6200ea" : "#333")};
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease;

  &:hover {
    background: #6200ea;
  }
`;

const Form = styled.div`
  margin-top: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #444;
  background: #222;
  color: white;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background: #6200ea;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  transition: 0.3s ease;

  &:hover {
    background: #8e24aa;
  }
`;

const RoomIdBox = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #2a2a2a;
  border: 1px dashed #888;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomIdText = styled.span`
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  word-break: break-word;
`;

const CopyButton = styled.button`
  background-color: #03dac6;
  color: black;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #00bfa5;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupCard = styled.div`
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
`;

const CloseButton = styled.button`
  margin-top: 15px;
  background: #ff1744;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #d50000;
  }
`;
