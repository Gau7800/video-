// Configuration for WebRTC
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// DOM Elements
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const secretCodeInput = document.getElementById('secret-code');
const timerDisplay = document.getElementById('timer');

let localStream;
let remoteStream;
let peerConnection;
let startTime;

// Get user media (camera and microphone)
async function startCall() {
  const secretCode = secretCodeInput.value.trim();
  if (!secretCode) {
    alert('Please enter a secret code.');
    return;
  }

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    // Create peer connection
    peerConnection = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Handle remote stream
    peerConnection.ontrack = event => {
      remoteVideo.srcObject = event.streams[0];
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        // Send the candidate to the other peer (you need a signaling server for this)
        console.log('ICE Candidate:', event.candidate);
      }
    };

    // Start timer
    startTime = Date.now();
    updateTimer();

    // Simulate signaling (replace with actual signaling server)
    if (secretCode === '1234') { // Replace with your secret code logic
      createOffer();
    }
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// Create an offer
async function createOffer() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Offer:', offer);

  // Simulate receiving an answer (replace with actual signaling server)
  simulateAnswer();
}

// Simulate receiving an answer
async function simulateAnswer() {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setRemoteDescription(answer);
  console.log('Answer:', answer);
}

// Update the timer
function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const seconds = (elapsedTime % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  setTimeout(updateTimer, 1000);
}