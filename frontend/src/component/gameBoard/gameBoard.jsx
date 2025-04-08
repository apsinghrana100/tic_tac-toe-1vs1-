import { useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";

const socket = io("https://real-time-tic-toe-game.onrender.com"); // Use deployed backend URL

const GamePage = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId"));
  const [name, setName] = useState({
    firstPlayer: localStorage.getItem("firstplayer") || "Player1",
    secondPlayer: localStorage.getItem("secondPlayer") || "Player2",
  });

  const handleClick = (index) => {
    if (board[index] || checkWinner()) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    socket.emit("makeMove", { roomId, board: newBoard, isXTurn: !isXTurn });
  };

  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : "Draw";
  };

  const winner = checkWinner();

  useEffect(() => {
    socket.emit("joinroom", {
      roomId,
      firstPlayer: name.firstPlayer,
      secondPlayer: name.secondPlayer,
    });
    socket.on("updateName", ({ firstPlayer, secondPlayer }) => {
      setName({
        firstPlayer: firstPlayer,
        secondPlayer: secondPlayer,
      });
      localStorage.setItem("firstplayer", firstPlayer);
      localStorage.setItem("secondPlayer", secondPlayer);
    });
    socket.on("updateGame", ({ board, isXTurn }) => {
      setBoard(board);
      setIsXTurn(isXTurn);
    });

    return () => {
      socket.off("updateGame");
    };
  }, []);

  return (
    <Container>
      <RoomIdTop>Room: {roomId}</RoomIdTop>

      <Header>
        <PlayerName isActive={isXTurn}>
          {isXTurn ? "🔥" : ""} {name.firstPlayer} (X)
        </PlayerName>
        <PlayerName isActive={!isXTurn}>
          {!isXTurn ? "🔥" : ""} {name.secondPlayer} (O)
        </PlayerName>
      </Header>

      <Board>
        {board.map((value, index) => (
          <Square
            key={index}
            onClick={() => {
              if (isXTurn) {
                handleClick(index);
              }
              if(!isXTurn){
                handleClick(index);
              }
            }}
            value={value}
          >
            {value === "X" ? (
              <XMarker>X</XMarker>
            ) : value === "O" ? (
              <OMarker>O</OMarker>
            ) : (
              ""
            )}
          </Square>
        ))}
      </Board>

      {winner && (
        <WinnerMessage>
          {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
        </WinnerMessage>
      )}

      <ResetButton onClick={() => socket.emit("resetgame", roomId)}>
        Restart Game
      </ResetButton>

      <Footer>Developed 💚 by Ajay Pratap Singh</Footer>
    </Container>
  );
};

export default GamePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #121212;
  color: white;
  padding: 10px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const PlayerName = styled.h2`
  font-size: 18px;
  color: ${(props) => (props.isActive ? "#f39c12" : "#bbb")};
  display: flex;
  align-items: center;
`;

const RoomIdTop = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #2a2a2a;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  color: #03dac6;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(80px, 100px));
  grid-template-rows: repeat(3, minmax(80px, 100px));
  gap: 5px;
  @media (max-width: 500px) {
    grid-template-columns: repeat(3, minmax(60px, 80px));
    grid-template-rows: repeat(3, minmax(60px, 80px));
  }
`;

const Square = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #333;
  }
`;

const XMarker = styled.span`
  color: cyan;
  font-size: 32px;
  font-weight: bold;
`;

const OMarker = styled.span`
  color: magenta;
  font-size: 32px;
  font-weight: bold;
`;

const WinnerMessage = styled.div`
  margin-top: 20px;
  font-size: 20px;
  color: #f39c12;
  font-weight: bold;
`;

const ResetButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: #e74c3c;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 10px;
  font-size: 12px;
  color: #888;
`;
