import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

const VideoCallApp: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callIncoming, setCallIncoming] = useState(false);
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { user_id } = useParams<{ user_id: string }>();

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl(`http://localhost:7227/signalingHub?user_id=${user_id}`)
      .withAutomaticReconnect()
      .build();

    setConnection(connect);

    connect.on("ReceiveOffer", async (senderUserId, receivedOffer) => {
      setCallIncoming(true);
      setOffer(receivedOffer);
      setUserId(senderUserId); // Save the caller's ID
    });

    connect.on("ReceiveAnswer", async (receivedAnswer: RTCSessionDescriptionInit) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(receivedAnswer);
      }
    });

    connect.on("ReceiveIceCandidate", async (candidate: RTCIceCandidateInit) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(candidate);
      }
    });

    connect.on("CallEnded", () => {
      endCall();
    });

    connect
      .start()
      .then(() => console.log("SignalR connected."))
      .catch((err) => console.error("SignalR connection failed:", err));

    return () => {
      connect.stop().then(() => console.log("SignalR disconnected."));
    };
  }, [user_id]);

  const handleCall = async () => {
    try {
      if (connection?.state !== "Connected") {
        await connection?.start();
      }      

      if (!userId) {
        console.error("Target user ID is required.");
        return;
      }

      peerConnection.current = new RTCPeerConnection(servers);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = async (event) => {
        if (connection) {
          await connection.invoke("SendIceCandidate", userId, event.candidate);
        }
      };

      const createdOffer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(createdOffer);

      const response = await fetch("http://localhost:7227/api/call/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: "default", senderUserId: user_id, offer: createdOffer }),
      });

      if (response.ok) {
        setIsCalling(true);
      } else {
        console.error("Failed to send offer:", await response.text());
      }
    } catch (err) {
      console.error("Error in handleCall:", err);
    }
  };

  const handleAccept = async () => {
    try {
      if (!connection || !offer) {
        console.error("Connection or offer missing.");
        return;
      }

      peerConnection.current = new RTCPeerConnection(servers);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate && connection.state === "Connected") {
          await connection.invoke("SendIceCandidate", userId, event.candidate);
        }
      };

      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      const response = await fetch("http://localhost:7227/api/call/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: "default", senderUserId: user_id, answer }),
      });

      if (response.ok) {
        setCallIncoming(false);
      } else {
        console.error("Failed to send answer:", await response.text());
      }
    } catch (err) {
      console.error("Error in handleAccept:", err);
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsMuted((prev) => !prev);
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsCameraOff((prev) => !prev);
    }
  };

  const endCall = () => {
    if (connection && userId) {
      connection.invoke("EndCall", userId).catch((err) => console.error("Failed to invoke EndCall:", err));
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setIsCalling(false);
    setCallIncoming(false);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter target user ID"
        value={userId || ""}
        onChange={(e) => setUserId(e.target.value)}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          style={{ width: "400px", border: "1px solid black" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          style={{ width: "400px", border: "1px solid black" }}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {callIncoming ? (
          <div>
            <p>Incoming Call...</p>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={endCall}>Reject</button>
          </div>
        ) : (
          <button onClick={handleCall} disabled={isCalling || !userId}>
            Call
          </button>
        )}
        <button onClick={endCall} disabled={!isCalling}>
          End Call
        </button>
        <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
        <button onClick={toggleCamera}>{isCameraOff ? "Turn Camera On" : "Turn Camera Off"}</button>
      </div>
    </div>
  );
};

export default VideoCallApp;
