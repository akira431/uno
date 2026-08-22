// ============================================================
//  UNO TRUTH OR DARE — game.js
//  Full UNO Engine + 8 Custom Truths/Dares + Multi-Card Combo +
//  Ultra-Reliable Real-Time Mobile Networking (WebRTC + BroadcastChannel)
// ============================================================

'use strict';

// ─── 8 DEFAULT TRUTHS & 8 DEFAULT DARES ───────────────────
const DEFAULT_TRUTHS = [
  "Apa rahasia paling memalukan yang belum pernah kamu ceritakan ke siapa pun?",
  "Siapa orang terakhir yang kamu kepoin akun media sosialnya dan kenapa?",
  "Ceritakan kebohongan terbesar yang pernah kamu katakan ke teman atau orang tua!",
  "Jika harus bertukar hidup dengan salah satu pemain di sini selama sehari, kamu pilih siapa?",
  "Hal terkonyol apa yang pernah kamu lakukan saat lagi naksir seseorang?",
  "Apa hal paling aneh atau memalukan di riwayat pencarian (search history) browser HP-mu?",
  "Kapan terakhir kali kamu pura-pura sakit atau buat alasan palsu agar tidak keluar rumah?",
  "Siapa di antara pemain di sini yang menurutmu paling unik / gokil dan apa alasannya?"
];

const DEFAULT_DARES = [
  "Tirukan gaya bicara atau tingkah salah satu pemain di sini selama 1 putaran penuh!",
  "Kirim voice note ke teman atau grup WA sambil menyanyikan lagu anak-anak secara heboh!",
  "Lakukan push-up 10 kali atau plank selama 30 detik sekarang juga!",
  "Tunjukkan foto paling konyol atau ekspresi wajah paling aneh di galeri HP kamu!",
  "Bicara dengan gaya robot atau komentator sepak bola sampai giliranmu berikutnya!",
  "Biarkan pemain lain menulis status singkat atau story lucu di akun media sosialmu!",
  "Minum segelas air putih tanpa menggunakan tangan (hanya boleh pakai mulut di meja)!",
  "Telepon salah satu kontak acak di HP dan katakan 'Aku punya rahasia, tapi nanti aja' lalu tutup!"
];

// Presets Seru & Gaul
const PRESET_FUN_TRUTHS = [
  "Siapa orang yang paling sering bikin kamu salting akhir-akhir ini?",
  "Lagu apa yang paling memalukan tapi sering kamu dengarkan diam-diam?",
  "Berapa uang jajan / saldo e-wallet kamu saat ini?",
  "Apa kebiasaan burukmu saat lagi sendirian di kamar?",
  "Pernah nggak naksir pacar atau gebetan teman sendiri?",
  "Kapan terakhir kali kamu menangis dan karena apa?",
  "Siapa pemain di meja ini yang paling sering ngeselin?",
  "Apa ketakutan teraneh yang kamu miliki sejak kecil?"
];

const PRESET_FUN_DARES = [
  "Gombalin salah satu pemain di sini sampai dia tersenyum atau tertawa!",
  "Joget ala TikTok / joget heboh tanpa musik selama 20 detik!",
  "Buka galeri HP dan biarkan pemain sebelah melihat 3 foto terakhir!",
  "Ucapkan kata 'Cilukba!' setiap kali ada pemain yang mengeluarkan kartu!",
  "Telepon nomor delivery makanan lalu tanya 'Ada jual martabak rasa nasi uduk nggak?'",
  "Tirukan suara hewan peliharaan (kucing/kambing) setiap kali giliranmu tiba!",
  "Kirim emoji acak '🥰🔥🐔' ke chat terakhir di WhatsApp tanpa penjelasan!",
  "Tahan tawa selama 30 detik sementara pemain lain mencoba membuatmu tertawa!"
];

// Presets Kocak & Gokil
const PRESET_SPICY_TRUTHS = [
  "Pernah kentut di tempat umum lalu menyalahkan orang lain? Ceritakan!",
  "Apa chat paling memalukan yang pernah kamu kirim salah kamar (salah grup)?",
  "Berapa hari terlama kamu pernah tidak mandi?",
  "Jika kamu harus menikah dengan salah satu pemain di sini, siapa yang kamu pilih?",
  "Apa barang paling tidak berguna yang pernah kamu beli saat impulsif?",
  "Pernah pura-pura lupa bayar utang makanan ke teman?",
  "Hal paling absurd apa yang pernah kamu yakini waktu masih kecil?",
  "Pernah ketahuan bohong secara langsung oleh orang tua atau guru?"
];

const PRESET_SPICY_DARES = [
  "Makan 1 sendok kecap / saus sambal atau campurkan 2 minuman berbeda!",
  "Kirim pesan ke teman: 'Aku baru tau ternyata bumi itu donat' lalu jangan balas 5 menit!",
  "Biarkan pemain sebelah menggambar kumis tipis di wajahmu dengan jari / pulpen!",
  "Berdiri dan buat pengumuman resmi seolah-olah kamu presiden selama 30 detik!",
  "Pakai kaos kaki di tanganmu sampai permainan UNO selesai!",
  "Tirukan gaya model catwalk berjalan mengitari ruangan!",
  "Tutup mata lalu tebak barang apa yang diletakkan di telapak tanganmu oleh pemain lain!",
  "Bicara tanpa menutup mulut / tanpa bibir bersentuhan selama 1 putaran!"
];

// ─── STATE KUSTOMISASI TRUTH & DARE ───────────────────────
let customTruths = [];
let customDares = [];

function loadCustomData() {
  try {
    const savedT = localStorage.getItem('uno_custom_truths_v1');
    const savedD = localStorage.getItem('uno_custom_dares_v1');
    customTruths = savedT ? JSON.parse(savedT) : [...DEFAULT_TRUTHS];
    customDares  = savedD ? JSON.parse(savedD) : [...DEFAULT_DARES];

    while (customTruths.length < 8) customTruths.push(`Pertanyaan #${customTruths.length + 1}`);
    while (customDares.length < 8)  customDares.push(`Tantangan #${customDares.length + 1}`);
    customTruths = customTruths.slice(0, 8);
    customDares  = customDares.slice(0, 8);
  } catch (e) {
    customTruths = [...DEFAULT_TRUTHS];
    customDares  = [...DEFAULT_DARES];
  }
}

function saveCustomData() {
  localStorage.setItem('uno_custom_truths_v1', JSON.stringify(customTruths));
  localStorage.setItem('uno_custom_dares_v1', JSON.stringify(customDares));
  if (mpState.isHost) {
    mpBroadcast({ type: 'SYNC_TOD', truths: customTruths, dares: customDares });
  }
}

// ─── GAME CONSTANTS ───────────────────────────────────────
const COLORS = ['red', 'blue', 'green', 'yellow'];
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ACTIONS = ['skip', 'reverse', 'draw2'];
const WILDS   = ['wild', 'wild4', 'wild_tod'];

const SYMBOL_MAP = {
  skip: '⊘', reverse: '⇄', draw2: '+2',
  wild: '★', wild4: '+4', wild_tod: '🎭',
  '0':'0','1':'1','2':'2','3':'3','4':'4',
  '5':'5','6':'6','7':'7','8':'8','9':'9'
};

const LABEL_MAP = {
  skip: 'SKIP', reverse: 'REV', draw2: '+2',
  wild: 'WILD', wild4: '+4', wild_tod: 'T & D'
};

const CARD_SCORE = { skip: 20, reverse: 20, draw2: 20, wild: 50, wild4: 50, wild_tod: 50 };

const AI_NAMES   = ['Nova 🤖', 'Zara 🎭', 'Rex 🦾'];
const AI_AVATARS = ['🤖', '🎭', '🦾'];

const AI_FUNNY_ANSWERS = [
  "Wah rahasia nih... Dulu aku pernah pura-pura nge-lag pas kalah game! 🤫",
  "Hmm sejujurnya aku pernah stalk akun bot sebelah selama 3 jam... 😂",
  "Kebohongan terbesar: Bilang 'Aku nggak makan kuota kok', padahal streaming 4K!",
  "Kalau tukar hidup, aku mau jadi kamu biar bisa main UNO sambil ngemil 🍕",
  "Paling konyol: Pernah salah kirim kode binary ke server pusat 🤖",
  "Riwayat search-ku isinya: 'Cara menang main UNO lawan manusia tanpa curang' 💻",
  "Pura-pura lowbat padahal cuma males diajak update software! 🔋",
  "Menurutku semua pemain di sini asik banget buat diajak seru-seruan!"
];

const AI_FUNNY_DARES = [
  "🤖 [Melakukan Tantangan] Menirukan suara robot era 90-an: 'BEEP BOOP BEEP!'",
  "🎭 [Melakukan Tantangan] Berbicara dengan nada dramatis ala sinetron!",
  "🦾 [Melakukan Tantangan] Melakukan push-up virtual sebanyak 100 kali dalam 1 milidetik!",
  "📱 [Melakukan Tantangan] Mengirimkan emoji ayam 🐔 ke layar utama!",
  "🎤 [Melakukan Tantangan] Menyanyikan lagu 'Bintang Kecil' versi elektro 8-bit!",
  "🕶️ [Melakukan Tantangan] Memasang kacamata hitam digital dan bergaya swag!",
  "🌊 [Melakukan Tantangan] Menirukan suara ombak pantai dengan speaker internal!",
  "💃 [Melakukan Tantangan] Menari robot dance dengan sangat kaku!"
];

// ─── GAME STATE ───────────────────────────────────────────
let state = {
  deck: [],
  discard: [],
  players: [],
  currentPlayer: 0,
  direction: 1,
  currentColor: 'red',
  phase: 'play',
  numPlayers: 2,
  gameMode: 'online',
  gameOver: false,
  pendingTod: null
};

// ─── COMBO & LOCAL PLAYER INFO ────────────────────────────
let isComboMode = false;
let selectedComboCards = [];
let pendingWildCard = null;
let pendingMultiWildCards = null;

let localPlayerName = "Pemain 1";
let localPlayerAvatar = "🧑";

// ─── HIGH-STABILITY NETWORKING CONFIG (Google STUN + WebRTC) ──
const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  }
};

const PEER_PREFIX = 'unotod-';
let mpState = {
  peer: null,
  channel: null,
  isOnline: false,
  isHost: false,
  roomCode: '',
  myPeerId: '',
  myPlayerIndex: 0,
  connections: [],
  hostConnection: null,
  lobbyPlayers: [],
  maxPlayers: 2,
  localClientId: 'cl_' + Math.random().toString(36).substring(2, 9),
  joinRetryTimer: null
};

// ─── DECK BUILDER ─────────────────────────────────────────
function buildDeck() {
  const cards = [];
  let id = 0;

  COLORS.forEach(color => {
    NUMBERS.forEach(n => {
      const count = (n === '0') ? 1 : 2;
      for (let c = 0; c < count; c++) {
        cards.push({ id: id++, color, value: n, type: 'number', display: n });
      }
    });
    ACTIONS.forEach(a => {
      for (let c = 0; c < 2; c++) {
        cards.push({ id: id++, color, value: a, type: 'action', display: SYMBOL_MAP[a] });
      }
    });
  });

  for (let c = 0; c < 4; c++) {
    cards.push({ id: id++, color: 'wild', value: 'wild', type: 'wild', display: '★' });
    cards.push({ id: id++, color: 'wild', value: 'wild4', type: 'wild', display: '+4' });
  }

  // 🎭 Special Truth or Dare Cards
  for (let c = 0; c < 4; c++) {
    cards.push({ id: id++, color: 'wild', value: 'wild_tod', type: 'wild', display: '🎭' });
  }

  return cards;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ─── INIT GAME ────────────────────────────────────────────
function initState(numPlayers, gameMode = 'online', onlinePlayers = null) {
  const deck = buildDeck();
  shuffle(deck);

  isComboMode = false;
  selectedComboCards = [];
  pendingWildCard = null;
  pendingMultiWildCards = null;

  let players = [];

  if (gameMode === 'online' && onlinePlayers) {
    players = onlinePlayers.map((p, idx) => ({
      id: idx,
      peerId: p.peerId,
      clientId: p.clientId,
      name: p.name || `Pemain ${idx + 1}`,
      avatar: p.avatar || '👤',
      isHuman: !p.isBot,
      isBot: !!p.isBot,
      hand: [],
      calledUno: false,
      score: 0
    }));
  } else if (gameMode === 'pass') {
    for (let i = 0; i < numPlayers; i++) {
      players.push({
        id: i,
        name: (i === 0) ? localPlayerName : `Pemain ${i + 1}`,
        avatar: (i === 0) ? localPlayerAvatar : (['🧑', '👧', '🧔', '👩'][i] || '👤'),
        isHuman: true,
        isBot: false,
        hand: [],
        calledUno: false,
        score: 0
      });
    }
  } else {
    // Solo vs AI
    players.push({
      id: 0,
      name: localPlayerName,
      avatar: localPlayerAvatar,
      isHuman: true,
      isBot: false,
      hand: [],
      calledUno: false,
      score: 0
    });
    for (let i = 1; i < numPlayers; i++) {
      players.push({
        id: i,
        name: AI_NAMES[i - 1],
        avatar: AI_AVATARS[i - 1],
        isHuman: false,
        isBot: true,
        hand: [],
        calledUno: false,
        score: 0
      });
    }
  }

  players.forEach(p => {
    for (let j = 0; j < 7; j++) p.hand.push(deck.pop());
  });

  let top;
  do {
    top = deck.pop();
  } while (top.type !== 'number');

  state = {
    deck,
    discard: [top],
    players,
    currentPlayer: 0,
    direction: 1,
    currentColor: top.color,
    phase: 'play',
    numPlayers: players.length,
    gameMode,
    gameOver: false,
    pendingTod: null
  };
}

// ─── GAME LOGIC ───────────────────────────────────────────
function topCard()   { return state.discard[state.discard.length - 1]; }
function currColor() { return state.currentColor; }

function isPlayable(card) {
  if (card.type === 'wild') return true;
  if (card.color === currColor()) return true;
  const top = topCard();
  if (top.type !== 'wild' && card.value === top.value) return true;
  return false;
}

function drawFromDeck(n = 1) {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    if (state.deck.length === 0) reshuffleDeck();
    if (state.deck.length === 0) break;
    drawn.push(state.deck.pop());
  }
  return drawn;
}

function reshuffleDeck() {
  if (state.discard.length <= 1) return;
  const top = state.discard.pop();
  state.deck = [...state.discard];
  shuffle(state.deck);
  state.discard = [top];
  showToast('🔄 Deck kartu dikocok ulang!');
}

function nextPlayerIndex(step = 1) {
  let n = state.currentPlayer;
  n = (n + state.direction * step + state.numPlayers * 10) % state.numPlayers;
  return n;
}

function advanceTurn(skipSteps = 1) {
  state.currentPlayer = nextPlayerIndex(skipSteps);
  state.players.forEach(p => p.calledUno = false);
  selectedComboCards = [];
}

// ─── PLAY SINGLE CARD ─────────────────────────────────────
function playCard(playerIndex, cardId, chosenColor = null) {
  if (state.gameMode === 'online' && !mpState.isHost) {
    sendActionToHost({
      type: 'ACTION_PLAY_CARD',
      cardId: cardId,
      chosenColor: chosenColor
    });
    return true;
  }

  const player = state.players[playerIndex];
  const idx = player.hand.findIndex(c => c.id === cardId);
  if (idx === -1) return false;
  const card = player.hand[idx];

  if (!isPlayable(card)) return false;

  player.hand.splice(idx, 1);
  state.discard.push(card);

  // 🎭 Special Truth or Dare Card
  if (card.value === 'wild_tod') {
    state.currentColor = chosenColor || 'red';
    const victim = state.players[nextPlayerIndex(1)];
    showToast(`🎭 ${player.name} memainkan TRUTH OR DARE ke ${victim.name}!`);
    
    triggerTruthOrDare(victim, `Ditargetkan oleh kartu Truth or Dare ${player.name}!`, () => {
      advanceTurn(1);
      checkPostPlay(player);
    });
    syncOnlineGameState();
    return true;
  }

  // Wild & Wild +4
  if (card.type === 'wild') {
    state.currentColor = chosenColor || 'red';
    if (card.value === 'wild4') {
      const victim = state.players[nextPlayerIndex(1)];
      showToast(`🔥 ${player.name} memainkan Wild +4 ke ${victim.name}!`);
      
      triggerTruthOrDare(victim, `Kena kartu Wild +4 dari ${player.name}! Selesaikan tantangan atau ambil 4 kartu!`, (completed) => {
        if (!completed) {
          const drawn = drawFromDeck(4);
          victim.hand.push(...drawn);
          showToast(`${victim.name} mengambil 4 kartu penalti!`);
        } else {
          showToast(`✨ ${victim.name} berhasil menyelesaikan tantangan!`);
        }
        advanceTurn(2);
        checkPostPlay(player);
      });
      syncOnlineGameState();
      return true;
    } else {
      advanceTurn(1);
    }
  } else if (card.type === 'action') {
    state.currentColor = card.color;
    if (card.value === 'skip') {
      const victim = state.players[nextPlayerIndex(1)];
      showToast(`🚫 ${victim.name} dilewati (Skip)!`);
      advanceTurn(2);
    } else if (card.value === 'reverse') {
      state.direction *= -1;
      showToast(`⇄ Arah putaran dibalik! (${state.direction === 1 ? '⟳ Searah Jarum Jam' : '⟲ Berlawanan'})`);
      if (state.numPlayers === 2) {
        advanceTurn(2);
      } else {
        advanceTurn(1);
      }
    } else if (card.value === 'draw2') {
      const victim = state.players[nextPlayerIndex(1)];
      showToast(`⚡ ${player.name} memainkan Draw +2 ke ${victim.name}!`);
      
      triggerTruthOrDare(victim, `Kena kartu Draw +2 dari ${player.name}! Jawab/Lakukan atau ambil 2 kartu!`, (completed) => {
        if (!completed) {
          const drawn = drawFromDeck(2);
          victim.hand.push(...drawn);
          showToast(`${victim.name} mengambil 2 kartu penalti!`);
        } else {
          showToast(`✨ ${victim.name} sukses menyelesaikan tantangan!`);
        }
        advanceTurn(2);
        checkPostPlay(player);
      });
      syncOnlineGameState();
      return true;
    }
  } else {
    state.currentColor = card.color;
    advanceTurn(1);
  }

  checkPostPlay(player);
  syncOnlineGameState();
  return true;
}

// ─── PLAY MULTIPLE / COMBO CARDS ──────────────────────────
function playMultipleCards(playerIndex, cardIds, chosenColor = null) {
  if (state.gameMode === 'online' && !mpState.isHost) {
    sendActionToHost({
      type: 'ACTION_PLAY_COMBO',
      cardIds: cardIds,
      chosenColor: chosenColor
    });
    return true;
  }

  const player = state.players[playerIndex];
  if (!cardIds || cardIds.length < 2) return false;

  const cardsToPlay = [];
  cardIds.forEach(id => {
    const c = player.hand.find(card => card.id === id);
    if (c) cardsToPlay.push(c);
  });

  if (cardsToPlay.length !== cardIds.length) return false;

  const firstValue = cardsToPlay[0].value;
  const allSameValue = cardsToPlay.every(c => c.value === firstValue);
  if (!allSameValue) {
    showToast('⚠️ Kartu combo harus memiliki angka/simbol yang sama!', 'warning');
    return false;
  }

  const hasPlayable = cardsToPlay.some(isPlayable);
  if (!hasPlayable) {
    showToast('⚠️ Minimal 1 kartu dalam combo harus cocok dengan kartu meja!', 'warning');
    return false;
  }

  const hasWild = cardsToPlay.some(c => c.type === 'wild');
  if (hasWild && !chosenColor) {
    pendingMultiWildCards = [...cardIds];
    openColorPicker();
    return true;
  }

  cardsToPlay.forEach(c => {
    const idx = player.hand.findIndex(h => h.id === c.id);
    if (idx !== -1) player.hand.splice(idx, 1);
    state.discard.push(c);
  });

  const lastCard = cardsToPlay[cardsToPlay.length - 1];
  const count = cardsToPlay.length;

  showToast(`⚡ COMBO ${count}x KARTU (${firstValue.toUpperCase()}) oleh ${player.name}! 🎉`, 'success');

  if (firstValue === 'wild_tod') {
    state.currentColor = chosenColor || 'red';
    const victim = state.players[nextPlayerIndex(1)];
    triggerTruthOrDare(victim, `Kena Mega Combo ${count}x Truth or Dare dari ${player.name}!`, () => {
      advanceTurn(1);
      checkPostPlay(player);
    });
    syncOnlineGameState();
    return true;
  } else if (firstValue === 'wild4') {
    state.currentColor = chosenColor || 'red';
    const totalDraw = count * 4;
    const victim = state.players[nextPlayerIndex(1)];
    
    triggerTruthOrDare(victim, `Kena Combo Wild +${totalDraw} (${count}x Wild +4) dari ${player.name}! Selesaikan tantangan atau ambil ${totalDraw} kartu!`, (completed) => {
      if (!completed) {
        const drawn = drawFromDeck(totalDraw);
        victim.hand.push(...drawn);
        showToast(`${victim.name} mengambil ${totalDraw} kartu penalti!`);
      } else {
        showToast(`✨ ${victim.name} berhasil lolos dari ${totalDraw} kartu penalti!`);
      }
      advanceTurn(2);
      checkPostPlay(player);
    });
    syncOnlineGameState();
    return true;
  } else if (firstValue === 'draw2') {
    state.currentColor = lastCard.color;
    const totalDraw = count * 2;
    const victim = state.players[nextPlayerIndex(1)];

    triggerTruthOrDare(victim, `Kena Combo Draw +${totalDraw} (${count}x +2) dari ${player.name}! Jawab/Lakukan atau ambil ${totalDraw} kartu!`, (completed) => {
      if (!completed) {
        const drawn = drawFromDeck(totalDraw);
        victim.hand.push(...drawn);
        showToast(`${victim.name} mengambil ${totalDraw} kartu penalti!`);
      } else {
        showToast(`✨ ${victim.name} sukses menyelesaikan tantangan!`);
      }
      advanceTurn(2);
      checkPostPlay(player);
    });
    syncOnlineGameState();
    return true;
  } else if (firstValue === 'skip') {
    state.currentColor = lastCard.color;
    showToast(`🚫 ${count} pemain dilewati sekaligus!`);
    advanceTurn(count + 1);
  } else if (firstValue === 'reverse') {
    state.currentColor = lastCard.color;
    if (count % 2 === 1) state.direction *= -1;
    showToast(`⇄ Arah putaran diubah (${count}x Reverse)!`);
    advanceTurn(1);
  } else if (firstValue === 'wild') {
    state.currentColor = chosenColor || 'red';
    advanceTurn(1);
  } else {
    state.currentColor = lastCard.color;
    advanceTurn(1);
  }

  isComboMode = false;
  selectedComboCards = [];
  checkPostPlay(player);
  syncOnlineGameState();
  return true;
}

function checkPostPlay(player) {
  if (player.hand.length === 1) {
    player.calledUno = false;
    if (player.isHuman && state.gameMode === 'ai') {
      showToast('⚠️ Sisa 1 kartu lagi — Cepat tekan tombol UNO!', 'warning');
    } else if (player.isBot) {
      setTimeout(() => {
        player.calledUno = true;
        showToast(`🔴 ${player.name}: "UNO!" 🎉`);
        renderAll();
        syncOnlineGameState();
      }, 500);
    }
  }

  if (player.hand.length === 0) {
    state.gameOver = true;
    const roundScore = calcRoundScore();
    player.score += roundScore;
    showWinner(player);
    syncOnlineGameState();
    return;
  }

  renderAll();
  scheduleNextAI();
}

function calcRoundScore() {
  let total = 0;
  state.players.forEach(p => {
    p.hand.forEach(c => {
      if (c.type === 'wild') total += CARD_SCORE[c.value] || 50;
      else if (c.type === 'action') total += CARD_SCORE[c.value] || 20;
      else total += parseInt(c.value) || 0;
    });
  });
  return total;
}

// ─── TRUTH OR DARE GAMEPLAY POPUP ─────────────────────────
let todTimerInterval = null;

function triggerTruthOrDare(targetPlayer, reason, onResolved) {
  state.pendingTod = {
    player: targetPlayer,
    reason: reason,
    onResolved: onResolved
  };

  const modal = document.getElementById('tod-popup-modal');
  const avatarEl = document.getElementById('tod-target-avatar');
  const nameEl   = document.getElementById('tod-target-name');
  const reasonEl = document.getElementById('tod-trigger-reason');

  avatarEl.textContent = targetPlayer.avatar;
  nameEl.textContent   = `Giliran: ${targetPlayer.name}`;
  reasonEl.textContent = reason;

  const isMyTarget = isCurrentClientPlayer(targetPlayer);

  document.getElementById('tod-choice-step').style.display = 'flex';
  document.getElementById('tod-result-step').style.display = 'none';
  document.getElementById('ai-response-box').style.display = 'none';

  const choiceButtons = document.querySelector('.tod-choice-buttons');
  const spectatorWait = document.getElementById('spectator-wait-msg');

  if (isMyTarget || (!targetPlayer.isHuman && mpState.isHost)) {
    choiceButtons.style.display = 'grid';
    spectatorWait.style.display = 'none';
  } else {
    choiceButtons.style.display = 'none';
    spectatorWait.style.display = 'block';
  }

  modal.classList.add('open');

  if (targetPlayer.isBot && (state.gameMode === 'ai' || mpState.isHost)) {
    setTimeout(() => {
      const chooseTruth = Math.random() > 0.5;
      handleTodChoice(chooseTruth ? 'truth' : 'dare', true);
    }, 1200);
  }
}

function isCurrentClientPlayer(player) {
  if (state.gameMode === 'online') {
    return player.id === mpState.myPlayerIndex;
  }
  return player.isHuman;
}

function handleTodChoice(type, isAi = false) {
  if (state.gameMode === 'online' && !mpState.isHost) {
    sendActionToHost({
      type: 'ACTION_TOD_CHOICE',
      choiceType: type
    });
    return;
  }

  const list = (type === 'truth') ? customTruths : customDares;
  const randomIndex = Math.floor(Math.random() * 8);
  const selectedText = list[randomIndex] || (type === 'truth' ? DEFAULT_TRUTHS[randomIndex] : DEFAULT_DARES[randomIndex]);
  const itemNumber = randomIndex + 1;

  displayTodResult(type, itemNumber, selectedText, isAi);

  if (state.gameMode === 'online' && mpState.isHost) {
    mpBroadcast({
      type: 'TOD_CHOICE_REVEAL',
      choiceType: type,
      itemNumber: itemNumber,
      selectedText: selectedText,
      isAi: isAi
    });
  }
}

function displayTodResult(type, itemNumber, selectedText, isAi = false) {
  const stepChoice = document.getElementById('tod-choice-step');
  const stepResult = document.getElementById('tod-result-step');
  const pillEl     = document.getElementById('tod-type-pill');
  const contentEl  = document.getElementById('tod-question-content');
  const spinner    = document.getElementById('roulette-spinner');
  const humanActions = document.getElementById('human-tod-actions');
  const botActions   = document.getElementById('bot-tod-actions');
  const aiBox        = document.getElementById('ai-response-box');
  const aiSpeech     = document.getElementById('ai-speech-bubble');

  stepChoice.style.display = 'none';
  stepResult.style.display = 'flex';

  pillEl.className = 'tod-type-pill ' + type;
  pillEl.textContent = (type === 'truth' ? '🧠 JUJUR (TRUTH)' : '🔥 TANTANGAN (DARE)') + ` #${itemNumber} dari 8`;

  spinner.style.display = 'block';
  contentEl.textContent = 'Mengacak dari 8 pilihan custom...';

  setTimeout(() => {
    spinner.style.display = 'none';
    contentEl.textContent = `"${selectedText}"`;

    const targetP = state.pendingTod ? state.pendingTod.player : state.players[state.currentPlayer];
    const isMe = isCurrentClientPlayer(targetP);

    if (isAi || targetP.isBot) {
      humanActions.style.display = 'none';
      botActions.style.display   = (state.gameMode === 'online' && !mpState.isHost) ? 'none' : 'flex';
      aiBox.style.display        = 'block';

      const aiAnswerPool = (type === 'truth') ? AI_FUNNY_ANSWERS : AI_FUNNY_DARES;
      aiSpeech.textContent = aiAnswerPool[(itemNumber - 1) % aiAnswerPool.length];
      startTodTimer(10);
    } else if (isMe) {
      humanActions.style.display = 'flex';
      botActions.style.display   = 'none';
      aiBox.style.display        = 'none';
      startTodTimer(30);
    } else {
      humanActions.style.display = 'none';
      botActions.style.display   = 'none';
      aiBox.style.display        = 'none';
      startTodTimer(30);
    }
  }, 700);
}

function startTodTimer(seconds = 30) {
  clearInterval(todTimerInterval);
  const fillEl = document.getElementById('timer-fill');
  const textEl = document.getElementById('timer-text');

  let remaining = seconds;
  fillEl.style.width = '100%';
  textEl.textContent = `⏱️ ${remaining} detik`;

  todTimerInterval = setInterval(() => {
    remaining--;
    const pct = Math.max(0, (remaining / seconds) * 100);
    fillEl.style.width = pct + '%';
    textEl.textContent = `⏱️ ${remaining} detik`;

    if (remaining <= 0) {
      clearInterval(todTimerInterval);
      textEl.textContent = '⏱️ Waktu Habis!';
    }
  }, 1000);
}

function resolveTruthOrDare(completed) {
  if (state.gameMode === 'online' && !mpState.isHost) {
    sendActionToHost({
      type: 'ACTION_TOD_RESOLVE',
      completed: completed
    });
    return;
  }

  clearInterval(todTimerInterval);
  const modal = document.getElementById('tod-popup-modal');
  modal.classList.remove('open');

  if (state.pendingTod && typeof state.pendingTod.onResolved === 'function') {
    const callback = state.pendingTod.onResolved;
    state.pendingTod = null;
    callback(completed);
  }

  if (state.gameMode === 'online' && mpState.isHost) {
    mpBroadcast({
      type: 'TOD_RESOLVED_POPUP'
    });
  }
}

// ─── AI DECISION LOGIC ────────────────────────────────────
function aiTurn() {
  const player = state.players[state.currentPlayer];
  if (!player.isBot) return;

  const playable = player.hand.filter(isPlayable);

  setTimeout(() => {
    if (playable.length === 0) {
      const drawn = drawFromDeck(1);
      player.hand.push(...drawn);
      showToast(`${player.name} mengambil 1 kartu`);
      const newPlayable = drawn.filter(isPlayable);
      if (newPlayable.length > 0) {
        setTimeout(() => aiPlayCardOrCombo(player, newPlayable[0]), 700);
      } else {
        advanceTurn(1);
        renderAll();
        syncOnlineGameState();
        scheduleNextAI();
      }
    } else {
      const comboCardGroup = findAiCombo(player);
      if (comboCardGroup && comboCardGroup.length >= 2 && Math.random() > 0.3) {
        let chosenColor = null;
        if (comboCardGroup[0].type === 'wild') chosenColor = chooseAIColor(player);
        playMultipleCards(state.currentPlayer, comboCardGroup.map(c => c.id), chosenColor);
      } else {
        const card = chooseAICard(player, playable);
        aiPlayCardOrCombo(player, card);
      }
    }
  }, 800 + Math.random() * 500);
}

function findAiCombo(player) {
  const groups = {};
  player.hand.forEach(c => {
    if (!groups[c.value]) groups[c.value] = [];
    groups[c.value].push(c);
  });

  for (const val in groups) {
    if (groups[val].length >= 2 && groups[val].some(isPlayable)) {
      return groups[val];
    }
  }
  return null;
}

function chooseAICard(player, playable) {
  const todCards = playable.filter(c => c.value === 'wild_tod');
  if (todCards.length > 0 && Math.random() > 0.3) return todCards[0];

  const actions = playable.filter(c => c.type === 'action');
  const numbers = playable.filter(c => c.type === 'number');
  const wilds   = playable.filter(c => c.type === 'wild');

  if (player.hand.length === 1) return playable[0];

  if (numbers.length > 0) {
    return numbers.reduce((best, c) => parseInt(c.value) > parseInt(best.value) ? c : best, numbers[0]);
  }
  if (actions.length > 0) return actions[0];
  if (wilds.length > 0)   return wilds[0];
  return playable[0];
}

function chooseAIColor(player) {
  const freq = { red: 0, blue: 0, green: 0, yellow: 0 };
  player.hand.forEach(c => { if (c.color in freq) freq[c.color]++; });
  return Object.entries(freq).sort((a,b) => b[1]-a[1])[0][0] || 'red';
}

function aiPlayCardOrCombo(player, card) {
  let chosenColor = null;
  if (card.type === 'wild') chosenColor = chooseAIColor(player);
  playCard(state.currentPlayer, card.id, chosenColor);
}

function scheduleNextAI() {
  if (state.gameOver || state.pendingTod) return;
  const curr = state.players[state.currentPlayer];
  if (curr && curr.isBot && (state.gameMode === 'ai' || mpState.isHost)) {
    aiTurn();
  }
}

// ─── RENDERING ────────────────────────────────────────────
function renderAll() {
  renderOpponents();
  renderPlayArea();
  renderPlayerHand();
  renderActionBar();
  renderDirectionIndicator();
}

function renderDirectionIndicator() {
  const el = document.getElementById('direction-indicator');
  if (el) el.textContent = state.direction === 1 ? '⟳' : '⟲';
}

function renderOpponents() {
  const zone = document.getElementById('opponents-zone');
  zone.innerHTML = '';

  const activeIdx = getActiveClientIndex();
  const opps = state.players.filter((_, idx) => idx !== activeIdx);

  const canKick = (state.gameMode === 'online' && mpState.isHost);

  opps.forEach(player => {
    const isActive = state.currentPlayer === player.id;
    const area = document.createElement('div');
    area.className = 'opponent-area';

    const label = document.createElement('div');
    label.className = 'player-label' + (isActive ? ' active' : '');
    label.innerHTML = `
      <span class="avatar">${player.avatar}</span>
      <span>${player.name}</span>
      <span class="card-count-badge">${player.hand.length} kartu</span>
      <span class="uno-badge ${player.hand.length === 1 ? 'visible' : ''}">UNO!</span>
      ${canKick ? `<button class="btn-kick-ingame" data-kick-ingame-id="${player.id}" title="Keluarkan ${player.isBot ? 'bot' : 'pemain'} ini">❌</button>` : ''}
    `;
    area.appendChild(label);

    const handEl = document.createElement('div');
    handEl.className = 'opponent-hand';
    const count = Math.min(player.hand.length, 10);
    const spread = Math.min(count * 14, 150);
    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'opp-card';
      const angle = count > 1 ? (i / (count - 1) - 0.5) * 16 : 0;
      const x     = count > 1 ? (i / (count - 1) - 0.5) * spread : 0;
      card.style.cssText = `
        transform: translateX(${x}px) rotate(${angle}deg);
        z-index: ${i};
        transform-origin: bottom center;
      `;
      handEl.appendChild(card);
    }
    area.appendChild(handEl);
    zone.appendChild(area);
  });

  if (canKick) {
    zone.querySelectorAll('.btn-kick-ingame').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.kickIngameId);
        const p = state.players[idx];
        if (!p) return;
        const ok = window.confirm(`Keluarkan ${p.name} dari permainan ini?`);
        if (ok) kickPlayerFromGame(idx);
      });
    });
  }
}

function renderPlayArea() {
  const discardEl = document.getElementById('top-card');
  const top = topCard();
  if (!top) return;

  const cardColorClass = (top.type === 'wild') ? (state.currentColor || 'wild') : top.color;
  discardEl.className = 'discard-card pile-card ' + cardColorClass;
  const sym = top.display || top.value;

  discardEl.innerHTML = `
    <span class="card-symbol">${sym}</span>
    <span class="card-corner tl">${sym}</span>
    <span class="card-corner br">${sym}</span>
  `;

  const colorEl = document.getElementById('color-indicator');
  if (colorEl) {
    const c = state.currentColor;
    const colorMap = { red:'#ef4444', blue:'#3b82f6', green:'#10b981', yellow:'#f59e0b' };
    colorEl.style.background = colorMap[c] || 'transparent';
  }

  const deckCount = document.getElementById('deck-count');
  if (deckCount) deckCount.textContent = state.deck.length;
}

function getActiveClientIndex() {
  if (state.gameMode === 'online') {
    return mpState.myPlayerIndex;
  }
  if (state.gameMode === 'pass') {
    return state.currentPlayer;
  }
  return 0;
}

function renderPlayerHand() {
  const container = document.getElementById('hand-container');
  const myIdx = getActiveClientIndex();
  const displayPlayer = state.players[myIdx];
  if (!displayPlayer) return;

  const isMyTurn = (state.currentPlayer === myIdx);

  const playerLabel = document.getElementById('human-player-label');
  const avatarEl = document.getElementById('human-avatar');
  const nameEl   = document.getElementById('human-name');
  const hintEl   = document.getElementById('turn-hint');

  if (playerLabel) {
    playerLabel.className = 'player-label' + (isMyTurn ? ' active' : '');
  }
  if (avatarEl) avatarEl.textContent = displayPlayer.avatar;
  if (nameEl)   nameEl.textContent   = displayPlayer.name + (state.gameMode === 'online' ? ' (Kamu)' : '');

  if (hintEl) {
    if (isComboMode) {
      hintEl.textContent = `⚡ Mode Combo Aktif! Pilih kartu-kartu kembar lalu klik tombol Keluarkan.`;
    } else if (isMyTurn) {
      hintEl.textContent = `Giliranmu! Klik kartu yang cocok, atau gunakan Mode Combo.`;
    } else {
      const activeP = state.players[state.currentPlayer];
      hintEl.textContent = `Sedang menunggu giliran ${activeP ? activeP.name : 'pemain lain'}...`;
    }
  }

  const unoBadge = document.getElementById('human-uno-badge');
  if (unoBadge) {
    unoBadge.className = 'uno-badge ' + (displayPlayer.hand.length === 1 && !displayPlayer.calledUno ? 'visible' : '');
  }

  container.innerHTML = '';
  displayPlayer.hand.forEach((card, i) => {
    const isSelected = selectedComboCards.includes(card.id);
    const playable = isMyTurn && (isPlayable(card) || isComboMode);

    const el = document.createElement('div');
    el.className = `hand-card ${card.color} ${!playable && !isSelected ? 'unplayable' : ''} ${isSelected ? 'selected' : ''}`;
    el.dataset.cardId = card.id;
    el.style.animationDelay = (i * 0.03) + 's';
    el.classList.add('dealing');

    let sym = card.display || card.value;
    let label = LABEL_MAP[card.value] || '';

    let badgeHtml = '';
    if (isSelected) {
      const orderIdx = selectedComboCards.indexOf(card.id) + 1;
      badgeHtml = `<span class="combo-order-badge">${orderIdx}</span>`;
    }

    el.innerHTML = `
      ${badgeHtml}
      <span class="pip tl">${sym}</span>
      <span class="card-num">${sym}</span>
      ${label ? `<span class="card-label">${label}</span>` : ''}
      <span class="pip br">${sym}</span>
    `;

    if (isMyTurn) {
      el.addEventListener('click', () => handlePlayerCardClick(card.id));
    }

    container.appendChild(el);
  });
}

function renderActionBar() {
  const myIdx = getActiveClientIndex();
  const isMyTurn = (state.currentPlayer === myIdx);

  const drawBtn       = document.getElementById('btn-draw');
  const comboModeBtn  = document.getElementById('btn-combo-mode');
  const playComboBtn  = document.getElementById('btn-play-combo');
  const cancelComboBtn= document.getElementById('btn-cancel-combo');
  const unoBtn        = document.getElementById('btn-uno');

  if (drawBtn) drawBtn.disabled = !isMyTurn || state.gameOver;

  if (comboModeBtn) {
    comboModeBtn.disabled = !isMyTurn || state.gameOver;
    comboModeBtn.className = 'btn btn-combo' + (isComboMode ? ' active' : '');
    comboModeBtn.textContent = isComboMode ? '⚡ Mode Combo (AKTIF)' : '⚡ Main Kartu Dobel / Combo';
  }

  if (playComboBtn && cancelComboBtn) {
    if (selectedComboCards.length >= 2) {
      const player = state.players[myIdx];
      const firstCard = player ? player.hand.find(c => c.id === selectedComboCards[0]) : null;
      const cardSym = firstCard ? (firstCard.display || firstCard.value) : '';

      playComboBtn.style.display = 'inline-flex';
      playComboBtn.textContent = `🔥 Keluarkan (${selectedComboCards.length}) Kartu [${cardSym}] Sekaligus!`;
      cancelComboBtn.style.display = 'inline-flex';
    } else {
      playComboBtn.style.display = 'none';
      cancelComboBtn.style.display = isComboMode ? 'inline-flex' : 'none';
    }
  }

  if (unoBtn) {
    const displayPlayer = state.players[myIdx];
    const showUno = displayPlayer && displayPlayer.hand.length === 1 && !displayPlayer.calledUno && isMyTurn;
    unoBtn.style.display = showUno ? 'inline-flex' : 'none';
  }
}

// ─── CARD CLICK & COMBO CONTROLLER ────────────────────────
function handlePlayerCardClick(cardId) {
  const myIdx = getActiveClientIndex();
  if (state.currentPlayer !== myIdx || state.gameOver) return;

  const player = state.players[myIdx];
  const card = player.hand.find(c => c.id === cardId);
  if (!card) return;

  if (isComboMode) {
    if (selectedComboCards.length === 0) {
      selectedComboCards.push(cardId);
    } else {
      const firstCard = player.hand.find(c => c.id === selectedComboCards[0]);
      if (firstCard && firstCard.value === card.value) {
        const existIdx = selectedComboCards.indexOf(cardId);
        if (existIdx !== -1) {
          selectedComboCards.splice(existIdx, 1);
        } else {
          selectedComboCards.push(cardId);
        }
      } else {
        selectedComboCards = [cardId];
        showToast(`💡 Memilih kelompok kartu [${card.display || card.value}]. Klik kartu kembarannya!`);
      }
    }
    renderAll();
    return;
  }

  if (!isPlayable(card)) {
    const el = document.querySelector(`[data-card-id="${cardId}"]`);
    if (el) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    }
    showToast('⚠️ Kartu ini tidak cocok dengan kartu di meja!');
    return;
  }

  if (card.type === 'wild') {
    pendingWildCard = cardId;
    openColorPicker();
    return;
  }

  playCard(myIdx, cardId);
}

function toggleComboMode() {
  const myIdx = getActiveClientIndex();
  if (state.currentPlayer !== myIdx || state.gameOver) return;

  isComboMode = !isComboMode;
  selectedComboCards = [];

  if (isComboMode) {
    const player = state.players[myIdx];
    const groups = {};
    player.hand.forEach(c => {
      if (!groups[c.value]) groups[c.value] = [];
      groups[c.value].push(c);
    });

    let autoSelected = false;
    for (const val in groups) {
      if (groups[val].length >= 2 && groups[val].some(isPlayable)) {
        selectedComboCards = groups[val].map(c => c.id);
        autoSelected = true;
        showToast(`⚡ ${groups[val].length}x Kartu [${groups[val][0].display}] otomatis dipilih! Klik tombol Keluarkan.`);
        break;
      }
    }

    if (!autoSelected) {
      showToast('⚡ Mode Combo Aktif! Klik 2 atau lebih kartu kembar di tanganmu.');
    }
  } else {
    showToast('Mode Normal');
  }

  renderAll();
}

function cancelCombo() {
  isComboMode = false;
  selectedComboCards = [];
  renderAll();
}

function executePlayCombo() {
  const myIdx = getActiveClientIndex();
  if (state.currentPlayer !== myIdx || state.gameOver) return;

  if (selectedComboCards.length < 2) {
    showToast('⚠️ Pilih minimal 2 kartu kembar!', 'warning');
    return;
  }

  playMultipleCards(myIdx, selectedComboCards);
}

// ─── COLOR PICKER (FIXED) ─────────────────────────────────
function openColorPicker() {
  document.getElementById('color-picker').classList.add('open');
}

function closeColorPicker() {
  document.getElementById('color-picker').classList.remove('open');
  pendingWildCard = null;
  pendingMultiWildCards = null;
}

function handleColorChoice(color) {
  const singleCardId = pendingWildCard;
  const multiCardIds = pendingMultiWildCards;

  document.getElementById('color-picker').classList.remove('open');
  pendingWildCard = null;
  pendingMultiWildCards = null;

  const myIdx = getActiveClientIndex();

  if (multiCardIds && multiCardIds.length > 0) {
    playMultipleCards(myIdx, multiCardIds, color);
    return;
  }

  if (singleCardId !== null && singleCardId !== undefined) {
    playCard(myIdx, singleCardId, color);
  }
}

// ─── ACTION BUTTON HANDLERS ───────────────────────────────
function handleDraw() {
  const myIdx = getActiveClientIndex();
  if (state.currentPlayer !== myIdx || state.gameOver) return;

  if (state.gameMode === 'online' && !mpState.isHost) {
    sendActionToHost({ type: 'ACTION_DRAW' });
    return;
  }

  const player = state.players[myIdx];
  const drawn = drawFromDeck(1);
  player.hand.push(...drawn);
  showToast(`${player.name} mengambil 1 kartu`);

  isComboMode = false;
  selectedComboCards = [];

  const newPlayable = drawn.filter(isPlayable);
  renderAll();

  if (newPlayable.length === 0) {
    advanceTurn(1);
    renderAll();
    scheduleNextAI();
  }

  syncOnlineGameState();
}

function handleUnoButton() {
  const myIdx = getActiveClientIndex();
  const player = state.players[myIdx];

  if (state.gameMode === 'online' && !mpState.isHost) {
    sendActionToHost({ type: 'ACTION_CALL_UNO' });
    return;
  }

  if (player && player.hand.length === 1) {
    player.calledUno = true;
    showToast(`🎉 ${player.name} teriak UNO!`, 'success');
    renderAll();
    syncOnlineGameState();
  }
}

// ─── LIVE EMOJI REACTIONS ─────────────────────────────────
function triggerLiveReaction(emoji, fromOnline = false) {
  const container = document.getElementById('reactions-container');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'floating-reaction';
  el.textContent = emoji;
  el.style.left = (20 + Math.random() * 60) + 'vw';
  el.style.bottom = '100px';

  container.appendChild(el);
  setTimeout(() => el.remove(), 2300);

  if (!fromOnline && state.gameMode === 'online') {
    if (mpState.isHost) {
      mpBroadcast({ type: 'LIVE_REACTION', emoji: emoji });
    } else {
      sendActionToHost({ type: 'ACTION_REACTION', emoji: emoji });
    }
  }
}

// ─── HIGH-RELIABILITY MULTIPLAYER NETWORKING ──────────────
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `UNO-${code}`;
}

function initHostRoom(maxPlayers = 2) {
  const roomCode = generateRoomCode();
  const peerId = (PEER_PREFIX + roomCode.replace('UNO-', '')).toLowerCase();

  mpState.isOnline = true;
  mpState.isHost = true;
  mpState.roomCode = roomCode;
  mpState.myPeerId = peerId;
  mpState.myPlayerIndex = 0;
  mpState.connections = [];
  mpState.maxPlayers = maxPlayers;

  mpState.lobbyPlayers = [
    { peerId: peerId, clientId: mpState.localClientId, name: localPlayerName, avatar: localPlayerAvatar, isHost: true }
  ];

  openOnlineLobby(roomCode);
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('lobby-connection-status').innerHTML =
    `<span class="status-dot online"></span> Ruangan Siap! Bagikan ke HP temanmu.`;

  // Init BroadcastChannel untuk sinkronisasi lokal antar-tab
  try {
    if (mpState.channel) mpState.channel.close();
    mpState.channel = new BroadcastChannel('unotod_room_' + roomCode.toUpperCase());
    mpState.channel.onmessage = (event) => {
      handleHostChannelMessage(event.data);
    };
  } catch (e) {
    console.log('BroadcastChannel not available:', e);
  }

  // Init PeerJS WebRTC dengan STUN Google untuk mabar 4G/5G/Wi-Fi antar HP
  if (typeof Peer !== 'undefined') {
    try {
      if (mpState.peer) mpState.peer.destroy();
      mpState.peer = new Peer(peerId, PEER_CONFIG);

      mpState.peer.on('open', (id) => {
        document.getElementById('lobby-connection-status').innerHTML =
          `<span class="status-dot online"></span> Ruangan Online Siap! Bagikan ke HP teman.`;
      });

      mpState.peer.on('connection', (conn) => {
        handleIncomingPeerConnection(conn);
      });

      mpState.peer.on('error', (err) => {
        console.warn('PeerJS warning:', err);
        if (err.type === 'unavailable-id') {
          initHostRoom(maxPlayers);
        }
      });
    } catch (e) {
      console.warn('PeerJS init failed:', e);
    }
  }

  showToast(`📱 Ruangan ${roomCode} siap untuk mabar!`, 'success');
}

function handleIncomingPeerConnection(conn) {
  if (mpState.lobbyPlayers.length >= mpState.maxPlayers) {
    const reject = () => {
      try { conn.send({ type: 'ROOM_FULL', message: 'Ruangan sudah penuh!' }); } catch (e) {}
      setTimeout(() => conn.close(), 500);
    };
    if (conn.open) reject();
    else conn.on('open', reject);
    return;
  }

  const registerConn = () => {
    if (!mpState.connections.some(c => c.peer === conn.peer)) {
      mpState.connections.push(conn);
    }
    // Kirim lobby state langsung saat koneksi tersambung
    mpBroadcastLobbyState();
  };

  // Pasang listener data secara langsung
  conn.on('data', (data) => {
    handleHostReceivedData(conn, data);
  });

  conn.on('close', () => {
    handlePeerDisconnected(conn);
  });

  if (conn.open) {
    registerConn();
  } else {
    conn.on('open', registerConn);
  }
}

function handleHostReceivedData(conn, data) {
  processIncomingHostAction(conn ? conn.peer : data.clientId, data);
}

function handleHostChannelMessage(data) {
  if (!data || data.senderClientId === mpState.localClientId) return;
  processIncomingHostAction(data.senderClientId, data);
}

function processIncomingHostAction(senderId, data) {
  if (!data) return;

  if (data.type === 'JOIN_REQUEST') {
    const existingIdx = mpState.lobbyPlayers.findIndex(p => 
      (senderId && p.peerId === senderId) || (data.clientId && p.clientId === data.clientId)
    );

    if (existingIdx !== -1) {
      // Update data jika sudah ada
      mpState.lobbyPlayers[existingIdx].name = data.name || mpState.lobbyPlayers[existingIdx].name;
      mpState.lobbyPlayers[existingIdx].avatar = data.avatar || mpState.lobbyPlayers[existingIdx].avatar;
    } else if (mpState.lobbyPlayers.length < mpState.maxPlayers) {
      const newPlayer = {
        peerId: senderId,
        clientId: data.clientId,
        name: data.name || `Pemain ${mpState.lobbyPlayers.length + 1}`,
        avatar: data.avatar || '👤',
        isHost: false
      };
      mpState.lobbyPlayers.push(newPlayer);
      addLobbyChatMessage('system', `👋 ${newPlayer.name} bergabung ke lobi!`);
    }

    // Selalu kirim balik LOBBY_UPDATE agar guest langsung tersinkron
    mpBroadcastLobbyState();
  } else if (data.type === 'ACTION_PLAY_CARD') {
    const pIdx = mpState.lobbyPlayers.findIndex(p => p.peerId === senderId || p.clientId === senderId);
    if (pIdx === state.currentPlayer) {
      playCard(pIdx, data.cardId, data.chosenColor);
    }
  } else if (data.type === 'ACTION_PLAY_COMBO') {
    const pIdx = mpState.lobbyPlayers.findIndex(p => p.peerId === senderId || p.clientId === senderId);
    if (pIdx === state.currentPlayer) {
      playMultipleCards(pIdx, data.cardIds, data.chosenColor);
    }
  } else if (data.type === 'ACTION_DRAW') {
    const pIdx = mpState.lobbyPlayers.findIndex(p => p.peerId === senderId || p.clientId === senderId);
    if (pIdx === state.currentPlayer) {
      handleDraw();
    }
  } else if (data.type === 'ACTION_CALL_UNO') {
    const pIdx = mpState.lobbyPlayers.findIndex(p => p.peerId === senderId || p.clientId === senderId);
    const p = state.players[pIdx];
    if (p && p.hand.length === 1) {
      p.calledUno = true;
      showToast(`🎉 ${p.name} teriak UNO!`, 'success');
      renderAll();
      syncOnlineGameState();
    }
  } else if (data.type === 'ACTION_TOD_CHOICE') {
    handleTodChoice(data.choiceType, false);
  } else if (data.type === 'ACTION_TOD_RESOLVE') {
    resolveTruthOrDare(data.completed);
  } else if (data.type === 'CHAT_MSG') {
    const p = mpState.lobbyPlayers.find(pl => pl.peerId === senderId || pl.clientId === senderId);
    const sender = p ? p.name : 'Tamu';
    addLobbyChatMessage('user', data.text, sender);
    mpBroadcast({ type: 'CHAT_MSG', sender: sender, text: data.text });
  } else if (data.type === 'ACTION_REACTION') {
    triggerLiveReaction(data.emoji, true);
    mpBroadcast({ type: 'LIVE_REACTION', emoji: data.emoji });
  }
}

function handlePeerDisconnected(conn) {
  const idx = mpState.lobbyPlayers.findIndex(p => p.peerId === conn.peer);
  if (idx !== -1) {
    const leftP = mpState.lobbyPlayers[idx];
    mpState.lobbyPlayers.splice(idx, 1);
    addLobbyChatMessage('system', `🚪 ${leftP.name} keluar dari ruangan.`);
    mpState.connections = mpState.connections.filter(c => c.peer !== conn.peer);
    mpBroadcastLobbyState();
  }
}

function mpBroadcast(payload) {
  mpState.connections.forEach(conn => {
    if (conn.open) {
      try { conn.send(payload); } catch (e) {}
    }
  });

  if (mpState.channel) {
    try {
      mpState.channel.postMessage({
        ...payload,
        senderClientId: mpState.localClientId
      });
    } catch (e) {}
  }
}

function mpBroadcastLobbyState() {
  mpState.connections.forEach((conn, index) => {
    const playerIndex = index + 1;
    if (conn.open) {
      try {
        conn.send({
          type: 'LOBBY_UPDATE',
          players: mpState.lobbyPlayers,
          playerIndex: playerIndex,
          maxPlayers: mpState.maxPlayers,
          customTruths: customTruths,
          customDares: customDares
        });
      } catch (e) {}
    }
  });

  if (mpState.channel) {
    try {
      mpState.channel.postMessage({
        type: 'LOBBY_UPDATE',
        players: mpState.lobbyPlayers,
        maxPlayers: mpState.maxPlayers,
        customTruths: customTruths,
        customDares: customDares,
        senderClientId: mpState.localClientId
      });
    } catch (e) {}
  }

  renderLobbyUI();
}

function joinOnlineRoom(roomCodeInput) {
  const cleanCode = roomCodeInput.trim().toUpperCase();
  const roomCode = cleanCode.startsWith('UNO-') ? cleanCode : `UNO-${cleanCode}`;
  const hostPeerId = (PEER_PREFIX + roomCode.replace('UNO-', '')).toLowerCase();

  clearInterval(mpState.joinRetryTimer);

  mpState.isOnline = true;
  mpState.isHost = false;
  mpState.roomCode = roomCode;

  // Inisialisasi tampilan awal agar Guest langsung melihat dirinya di lobi
  mpState.lobbyPlayers = [
    { peerId: hostPeerId, clientId: 'host', name: 'Host Ruangan', avatar: '👑', isHost: true },
    { peerId: 'me', clientId: mpState.localClientId, name: localPlayerName, avatar: localPlayerAvatar, isHost: false }
  ];
  mpState.myPlayerIndex = 1;

  openOnlineLobby(roomCode);
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('lobby-connection-status').innerHTML =
    `<span class="status-dot online"></span> Menghubungkan ke HP Host (${roomCode})...`;

  // 1. Koneksi BroadcastChannel lokal
  try {
    if (mpState.channel) mpState.channel.close();
    mpState.channel = new BroadcastChannel('unotod_room_' + roomCode.toUpperCase());
    mpState.channel.onmessage = (event) => {
      handleClientReceivedData(event.data);
    };

    mpState.channel.postMessage({
      type: 'JOIN_REQUEST',
      clientId: mpState.localClientId,
      name: localPlayerName,
      avatar: localPlayerAvatar,
      senderClientId: mpState.localClientId
    });
  } catch (e) {}

  // 2. Koneksi WebRTC PeerJS
  if (typeof Peer !== 'undefined') {
    try {
      if (mpState.peer) mpState.peer.destroy();
      mpState.peer = new Peer(PEER_CONFIG);

      mpState.peer.on('open', (myId) => {
        mpState.myPeerId = myId;
        const conn = mpState.peer.connect(hostPeerId, { reliable: true });
        mpState.hostConnection = conn;

        const sendJoin = () => {
          try {
            conn.send({
              type: 'JOIN_REQUEST',
              clientId: mpState.localClientId,
              name: localPlayerName,
              avatar: localPlayerAvatar
            });
            document.getElementById('lobby-connection-status').innerHTML =
              `<span class="status-dot online"></span> ✅ Terhubung ke Lobi Host!`;
          } catch (e) {}
        };

        conn.on('data', (data) => {
          handleClientReceivedData(data);
        });

        conn.on('close', () => {
          showToast('🚪 Terputus dari Ruangan Host', 'warning');
        });

        if (conn.open) {
          sendJoin();
        } else {
          conn.on('open', sendJoin);
        }

        // Retry handshake periodically in case of mobile network packet delays
        mpState.joinRetryTimer = setInterval(() => {
          if (conn.open) {
            sendJoin();
          }
        }, 1500);
      });

      mpState.peer.on('error', (err) => {
        console.warn('PeerJS join notice:', err);
      });
    } catch (e) {
      console.warn('PeerJS join error:', e);
    }
  }

  showToast(`🌐 Menghubungkan ke Ruangan ${roomCode}...`, 'info');
}

function handleClientReceivedData(data) {
  if (!data || data.senderClientId === mpState.localClientId) return;

  if (data.type === 'LOBBY_UPDATE') {
    clearInterval(mpState.joinRetryTimer);
    mpState.lobbyPlayers = data.players;
    const myIndexInList = data.players.findIndex(p => p.clientId === mpState.localClientId);
    if (myIndexInList !== -1) {
      mpState.myPlayerIndex = myIndexInList;
    } else if (typeof data.playerIndex === 'number') {
      mpState.myPlayerIndex = data.playerIndex;
    }
    mpState.maxPlayers = data.maxPlayers || 2;
    if (data.customTruths) customTruths = data.customTruths;
    if (data.customDares)  customDares  = data.customDares;

    document.getElementById('lobby-connection-status').innerHTML =
      `<span class="status-dot online"></span> ✅ Terhubung ke Lobi Host!`;

    renderLobbyUI();
  } else if (data.type === 'GAME_START') {
    clearInterval(mpState.joinRetryTimer);
    document.getElementById('online-lobby-modal').classList.remove('open');
    document.getElementById('start-screen').style.display = 'none';
    state = data.state;
    state.gameMode = 'online';

    const myIndexInList = state.players.findIndex(p => p.clientId === mpState.localClientId);
    if (myIndexInList !== -1) {
      mpState.myPlayerIndex = myIndexInList;
    }

    document.getElementById('online-room-badge').style.display = 'flex';
    document.getElementById('header-room-code').textContent = mpState.roomCode;
    document.getElementById('header-mode-tag').textContent = 'Mabar Beda HP';

    renderAll();
    showToast('🎮 Game Dimulai!', 'success');
  } else if (data.type === 'STATE_SYNC') {
    state = data.state;
    state.gameMode = 'online';
    renderAll();
  } else if (data.type === 'SYNC_TOD') {
    customTruths = data.truths;
    customDares  = data.dares;
    showToast('📝 8 Truth & Dare diperbarui oleh Host!', 'info');
  } else if (data.type === 'TOD_CHOICE_REVEAL') {
    displayTodResult(data.choiceType, data.itemNumber, data.selectedText, data.isAi);
  } else if (data.type === 'TOD_RESOLVED_POPUP') {
    clearInterval(todTimerInterval);
    document.getElementById('tod-popup-modal').classList.remove('open');
  } else if (data.type === 'CHAT_MSG') {
    addLobbyChatMessage('user', data.text, data.sender);
  } else if (data.type === 'LIVE_REACTION') {
    triggerLiveReaction(data.emoji, true);
  } else if (data.type === 'KICKED') {
    showToast('❌ ' + (data.message || 'Kamu dikeluarkan oleh Host.'), 'error');
    clearInterval(todTimerInterval);
    closeOnlineLobby();
    document.getElementById('tod-popup-modal').classList.remove('open');
    document.getElementById('color-picker').classList.remove('open');
    document.getElementById('winner-screen').classList.remove('open');
    document.getElementById('online-room-badge').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
  } else if (data.type === 'HOST_LEFT') {
    showToast('🚪 Host telah meninggalkan permainan. Kamu akan kembali ke menu.', 'warning');
    closeOnlineLobby();
    document.getElementById('tod-popup-modal').classList.remove('open');
    document.getElementById('color-picker').classList.remove('open');
    document.getElementById('winner-screen').classList.remove('open');
    document.getElementById('start-screen').style.display = 'flex';
  }
}

function sendActionToHost(actionPayload) {
  actionPayload.clientId = mpState.localClientId;
  actionPayload.senderClientId = mpState.localClientId;

  if (mpState.hostConnection && mpState.hostConnection.open) {
    try { mpState.hostConnection.send(actionPayload); } catch (e) {}
  }

  if (mpState.channel) {
    try {
      mpState.channel.postMessage(actionPayload);
    } catch (e) {}
  }
}

function syncOnlineGameState() {
  if (state.gameMode === 'online' && mpState.isHost) {
    mpBroadcast({
      type: 'STATE_SYNC',
      state: state
    });
  }
}

// ─── LOBBY UI & QR CODE CONTROLLER ────────────────────────
function renderLobbyQRCode(roomCode) {
  const qrContainer = document.getElementById('qrcode-box');
  if (!qrContainer || typeof QRCode === 'undefined') return;
  qrContainer.innerHTML = '';
  
  let targetUrl = window.location.href.split('#')[0] + '#room=' + encodeURIComponent(roomCode);
  if (targetUrl.startsWith('file:///')) {
    targetUrl = roomCode;
  }

  new QRCode(qrContainer, {
    text: targetUrl,
    width: 140,
    height: 140,
    colorDark : "#07071a",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.M
  });
}

function openOnlineLobby(roomCode) {
  document.getElementById('lobby-room-code-text').textContent = roomCode;
  document.getElementById('online-lobby-modal').classList.add('open');

  const startBtn = document.getElementById('btn-start-online-game');
  const addBotBtn= document.getElementById('btn-lobby-add-bot');

  if (mpState.isHost) {
    startBtn.style.display = 'inline-flex';
    addBotBtn.style.display = 'inline-flex';
  } else {
    startBtn.style.display = 'none';
    addBotBtn.style.display = 'none';
  }

  renderLobbyUI();
}

function closeOnlineLobby() {
  clearInterval(mpState.joinRetryTimer);
  document.getElementById('online-lobby-modal').classList.remove('open');
  if (mpState.peer) {
    mpState.peer.destroy();
    mpState.peer = null;
  }
  if (mpState.channel) {
    mpState.channel.close();
    mpState.channel = null;
  }
  mpState.isOnline = false;
}

function renderLobbyUI() {
  const container = document.getElementById('lobby-slots-container');
  const countEl   = document.getElementById('lobby-players-count');
  const startBtn  = document.getElementById('btn-start-online-game');

  container.innerHTML = '';
  const totalSlots = mpState.maxPlayers || 2;
  countEl.textContent = `${mpState.lobbyPlayers.length}/${totalSlots}`;

  for (let i = 0; i < totalSlots; i++) {
    const player = mpState.lobbyPlayers[i];
    const slotEl = document.createElement('div');

    if (player) {
      slotEl.className = 'player-slot-card occupied';
      let badge = player.isHost
        ? '<span class="slot-badge host">HOST</span>'
        : (player.isBot ? '<span class="slot-badge bot">BOT</span>' : '<span class="slot-badge ready">SIAP</span>');

      // Host can kick non-host players
      let kickBtn = '';
      if (mpState.isHost && !player.isHost) {
        kickBtn = `<div class="slot-actions"><button class="btn-kick-player" data-kick-index="${i}" title="Keluarkan pemain ini">❌ Kick</button></div>`;
      }

      slotEl.innerHTML = `
        <span class="slot-avatar">${player.avatar}</span>
        <div class="slot-info">
          <span class="slot-name">${player.name}</span>
          ${badge}
        </div>
        ${kickBtn}
      `;
    } else {
      slotEl.className = 'player-slot-card empty';
      slotEl.innerHTML = `
        <span class="slot-avatar">⏳</span>
        <div class="slot-info">
          <span class="slot-name" style="color:rgba(255,255,255,0.4)">Menunggu HP teman...</span>
        </div>
      `;
    }
    container.appendChild(slotEl);
  }

  // Attach kick button event listeners
  container.querySelectorAll('.btn-kick-player').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.kickIndex);
      kickPlayerFromLobby(idx);
    });
  });

  if (mpState.isHost && startBtn) {
    startBtn.disabled = (mpState.lobbyPlayers.length < 2);
  }
}

function addLobbyChatMessage(type, text, sender = '') {
  const container = document.getElementById('lobby-chat-messages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + type;

  if (type === 'system') {
    msg.textContent = text;
  } else {
    msg.innerHTML = `<span class="sender">${sender}:</span> ${escapeHtml(text)}`;
  }

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function sendLobbyChat() {
  const input = document.getElementById('lobby-chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addLobbyChatMessage('user', text, localPlayerName);

  if (state.gameMode === 'online') {
    if (mpState.isHost) {
      mpBroadcast({ type: 'CHAT_MSG', sender: localPlayerName, text: text });
    } else {
      sendActionToHost({ type: 'CHAT_MSG', text: text });
    }
  }
}

function kickPlayerFromLobby(playerIndex) {
  if (!mpState.isHost) return;
  if (playerIndex < 0 || playerIndex >= mpState.lobbyPlayers.length) return;

  const kicked = mpState.lobbyPlayers[playerIndex];
  if (kicked.isHost) return; // Cannot kick yourself (host)

  // Disconnect the peer connection if it's a real player
  if (!kicked.isBot) {
    const conn = mpState.connections.find(c => c.peer === kicked.peerId);
    if (conn) {
      try {
        conn.send({ type: 'KICKED', message: 'Kamu dikeluarkan oleh Host.' });
        setTimeout(() => conn.close(), 300);
      } catch (e) {}
      mpState.connections = mpState.connections.filter(c => c.peer !== kicked.peerId);
    }
  }

  mpState.lobbyPlayers.splice(playerIndex, 1);
  addLobbyChatMessage('system', `❌ ${kicked.name} telah dikeluarkan dari ruangan oleh Host.`);
  showToast(`❌ ${kicked.name} dikeluarkan dari ruangan.`, 'warning');
  mpBroadcastLobbyState();
}

// ─── KICK PEMAIN / BOT SAAT PERMAINAN BERLANGSUNG ─────────
function kickPlayerFromGame(targetIndex) {
  if (!mpState.isHost || state.gameMode !== 'online') return;
  if (targetIndex < 0 || targetIndex >= state.players.length) return;

  const target = state.players[targetIndex];
  if (!target) return;
  if (!target.isBot && target.clientId === mpState.localClientId) {
    showToast('⚠️ Kamu tidak bisa mengeluarkan dirimu sendiri.', 'warning');
    return;
  }

  // Jika pemain yang dikick sedang jadi target Truth or Dare, batalkan popup itu dulu
  if (state.pendingTod && state.pendingTod.player === target) {
    clearInterval(todTimerInterval);
    document.getElementById('tod-popup-modal').classList.remove('open');
    state.pendingTod = null;
  }

  // Kembalikan kartu di tangannya ke deck lalu kocok ulang
  if (target.hand && target.hand.length) {
    state.deck.push(...target.hand);
    shuffle(state.deck);
  }

  const wasCurrentTurn = (state.currentPlayer === targetIndex);

  // Putuskan koneksi jika pemain asli (bukan bot)
  if (!target.isBot) {
    const conn = mpState.connections.find(c => c.peer === target.peerId);
    if (conn) {
      try {
        conn.send({ type: 'KICKED', message: 'Kamu dikeluarkan oleh Host dari permainan.' });
        setTimeout(() => conn.close(), 300);
      } catch (e) {}
      mpState.connections = mpState.connections.filter(c => c.peer !== target.peerId);
    }
  }

  state.players.splice(targetIndex, 1);
  if (mpState.lobbyPlayers[targetIndex]) mpState.lobbyPlayers.splice(targetIndex, 1);

  // Sinkronkan ulang id agar tetap sama dengan index array
  state.players.forEach((p, i) => { p.id = i; });
  state.numPlayers = state.players.length;

  showToast(`❌ ${target.name} dikeluarkan dari permainan.`, 'warning');

  // Jika tersisa kurang dari 2 pemain, permainan otomatis selesai
  if (state.players.length < 2) {
    state.gameOver = true;
    mpBroadcast({ type: 'STATE_SYNC', state: state });
    showWinner(state.players[0]);
    return;
  }

  // Sesuaikan giliran yang sedang berjalan
  if (targetIndex < state.currentPlayer) {
    state.currentPlayer -= 1;
  } else if (wasCurrentTurn) {
    state.currentPlayer = state.currentPlayer % state.players.length;
  }

  renderAll();
  mpBroadcast({ type: 'STATE_SYNC', state: state });

  if (wasCurrentTurn) {
    const nowPlayer = state.players[state.currentPlayer];
    if (nowPlayer && nowPlayer.isBot) scheduleNextAI();
  }
}

function startOnlineGameHost() {
  if (!mpState.isHost || mpState.lobbyPlayers.length < 2) return;

  document.getElementById('online-lobby-modal').classList.remove('open');
  document.getElementById('start-screen').style.display = 'none';

  initState(mpState.lobbyPlayers.length, 'online', mpState.lobbyPlayers);

  document.getElementById('online-room-badge').style.display = 'flex';
  document.getElementById('header-room-code').textContent = mpState.roomCode;
  document.getElementById('header-mode-tag').textContent = 'Mabar Beda HP';

  renderAll();

  mpBroadcast({
    type: 'GAME_START',
    state: state
  });

  showToast(`🎮 Permainan Mabar Dimulai! Host: ${localPlayerName}`, 'success');
  scheduleNextAI();
}

// ─── EDITOR 8 TRUTH & 8 DARE ──────────────────────────────
function renderTodEditorInputs() {
  const truthContainer = document.getElementById('truth-inputs-container');
  const dareContainer  = document.getElementById('dare-inputs-container');

  truthContainer.innerHTML = '';
  dareContainer.innerHTML  = '';

  for (let i = 0; i < 8; i++) {
    const row = document.createElement('div');
    row.className = 'input-row truth';
    row.innerHTML = `
      <span class="input-badge">#${i + 1}</span>
      <input type="text" class="tod-input truth-val" data-index="${i}" 
             placeholder="Masukkan pertanyaan ke-${i + 1}..." 
             value="${escapeHtml(customTruths[i] || '')}">
    `;
    truthContainer.appendChild(row);
  }

  for (let i = 0; i < 8; i++) {
    const row = document.createElement('div');
    row.className = 'input-row dare';
    row.innerHTML = `
      <span class="input-badge">#${i + 1}</span>
      <input type="text" class="tod-input dare-val" data-index="${i}" 
             placeholder="Masukkan tantangan ke-${i + 1}..." 
             value="${escapeHtml(customDares[i] || '')}">
    `;
    dareContainer.appendChild(row);
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function saveEditorInputs() {
  const truthInputs = document.querySelectorAll('.truth-val');
  const dareInputs  = document.querySelectorAll('.dare-val');

  truthInputs.forEach((input, i) => {
    const val = input.value.trim();
    customTruths[i] = val || DEFAULT_TRUTHS[i];
  });

  dareInputs.forEach((input, i) => {
    const val = input.value.trim();
    customDares[i] = val || DEFAULT_DARES[i];
  });

  saveCustomData();
  closeTodEditor();
  showToast('💾 8 Pertanyaan & 8 Tantangan berhasil disimpan!', 'success');
  updateTodSummaryBadge();
}

function openTodEditor() {
  renderTodEditorInputs();
  document.getElementById('tod-editor-modal').classList.add('open');
}

function closeTodEditor() {
  document.getElementById('tod-editor-modal').classList.remove('open');
}

function updateTodSummaryBadge() {
  const badge = document.getElementById('tod-status-summary');
  if (badge) {
    badge.textContent = `✨ 8 Truth & 8 Dare Siap!`;
  }
}

function applyPreset(presetTruths, presetDares, label) {
  customTruths = [...presetTruths];
  customDares  = [...presetDares];
  renderTodEditorInputs();
  showToast(`💡 Preset "${label}" dimuat! Klik Simpan untuk menerapkan.`, 'info');
}

// ─── EXIT GAME LOGIC ──────────────────────────────────────
function openExitConfirm() {
  document.getElementById('exit-confirm-modal').classList.add('open');
}

function closeExitConfirm() {
  document.getElementById('exit-confirm-modal').classList.remove('open');
}

function confirmExitGame() {
  closeExitConfirm();

  // Clear all timers and state
  clearInterval(todTimerInterval);
  state.gameOver = true;
  isComboMode = false;
  selectedComboCards = [];
  pendingWildCard = null;
  pendingMultiWildCards = null;

  // Close any open modals
  document.getElementById('tod-popup-modal').classList.remove('open');
  document.getElementById('color-picker').classList.remove('open');
  document.getElementById('winner-screen').classList.remove('open');

  // Disconnect online connections if applicable
  if (mpState.isOnline) {
    if (mpState.isHost) {
      mpBroadcast({ type: 'HOST_LEFT', message: 'Host telah meninggalkan permainan.' });
    }
    closeOnlineLobby();
  }

  // Reset game UI
  document.getElementById('game-container').style.display = '';
  document.getElementById('start-screen').style.display = 'flex';
  document.getElementById('online-room-badge').style.display = 'none';

  showToast('🚪 Kamu telah keluar dari permainan.', 'info');
}

// ─── UI HELPERS & NOTIFIKASI ──────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const colors = {
    info: '',
    success: 'color:#34d399; border-color:rgba(52,211,153,0.4);',
    warning: 'color:#fbbf24; border-color:rgba(251,191,36,0.4);',
    error:   'color:#f87171; border-color:rgba(248,113,113,0.4);'
  };
  toast.style.cssText = colors[type] || '';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function showWinner(player) {
  state.gameOver = true;
  const screen = document.getElementById('winner-screen');
  screen.classList.add('open');

  document.getElementById('winner-name').textContent = `🏆 ${player.name} Menang!`;
  document.getElementById('winner-subtitle').textContent =
    `Selamat kepada ${player.name} yang telah menghabiskan semua kartu di UNO Truth or Dare!`;

  const scoreList = document.getElementById('score-list');
  scoreList.innerHTML = '';
  state.players.forEach(p => {
    const row = document.createElement('div');
    row.className = 'score-row';
    const pts = p.hand.reduce((sum, c) => {
      if (c.type === 'wild') return sum + (CARD_SCORE[c.value] || 50);
      if (c.type === 'action') return sum + (CARD_SCORE[c.value] || 20);
      return sum + (parseInt(c.value) || 0);
    }, 0);
    row.innerHTML = `<span>${p.avatar} ${p.name}</span><span class="pts">${p.hand.length} kartu (${pts} poin sisa)</span>`;
    scoreList.appendChild(row);
  });
}

// ─── BACKGROUND STARS ─────────────────────────────────────
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
      --d: ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${0.1 + Math.random() * 0.5};
    `;
    container.appendChild(star);
  }
}

// ─── SETUP START SCREEN & EVENTS ──────────────────────────
let selectedPlayerCount = 2;
let selectedOnlineCapacity = 2;
let selectedGameMode = 'online';

function setupStartScreen() {
  // Offline Count Buttons
  const countBtns = document.querySelectorAll('#count-buttons .count-btn');
  countBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      countBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPlayerCount = parseInt(btn.dataset.count);
    });
  });

  // Online Capacity Buttons
  const onlineCountBtns = document.querySelectorAll('#online-count-buttons .count-btn');
  onlineCountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      onlineCountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOnlineCapacity = parseInt(btn.dataset.count);
    });
  });

  // Mode Selection Cards
  const modeCards = document.querySelectorAll('.mode-card-btn');
  const offlineCountGroup = document.getElementById('offline-count-group');
  const onlineSetupPanel  = document.getElementById('online-setup-panel');
  const startOfflineBtn   = document.getElementById('btn-start-game');

  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedGameMode = card.dataset.mode;

      if (selectedGameMode === 'online') {
        offlineCountGroup.style.display = 'none';
        onlineSetupPanel.style.display  = 'block';
        startOfflineBtn.style.display   = 'none';
      } else {
        offlineCountGroup.style.display = 'flex';
        onlineSetupPanel.style.display  = 'none';
        startOfflineBtn.style.display   = 'inline-flex';
      }
    });
  });

  // Profil & Avatar Selector
  const avatarTrigger = document.getElementById('avatar-picker-trigger');
  const avatarTray    = document.getElementById('avatar-tray');
  const avatarDisplay = document.getElementById('current-avatar-display');
  const nameInput     = document.getElementById('player-name-input');

  avatarTrigger.addEventListener('click', () => {
    avatarTray.style.display = (avatarTray.style.display === 'none') ? 'flex' : 'none';
  });

  document.querySelectorAll('.avatar-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      localPlayerAvatar = opt.textContent;
      avatarDisplay.textContent = localPlayerAvatar;
      avatarTray.style.display = 'none';
    });
  });

  nameInput.addEventListener('input', () => {
    localPlayerName = nameInput.value.trim() || 'Pemain 1';
  });

  // Online Sub-tabs
  const tabCreate = document.getElementById('tab-btn-create-room');
  const tabJoin   = document.getElementById('tab-btn-join-room');
  const viewCreate= document.getElementById('view-create-room');
  const viewJoin  = document.getElementById('view-join-room');

  tabCreate.addEventListener('click', () => {
    tabCreate.classList.add('active');
    tabJoin.classList.remove('active');
    viewCreate.classList.add('active');
    viewJoin.classList.remove('active');
  });

  tabJoin.addEventListener('click', () => {
    tabJoin.classList.add('active');
    tabCreate.classList.remove('active');
    viewJoin.classList.add('active');
    viewCreate.classList.remove('active');
  });

  // Start Offline Game
  startOfflineBtn.addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    startGameOffline(selectedPlayerCount, selectedGameMode);
  });

  // Online Action Buttons (Create & Join)
  document.getElementById('btn-create-online-room').addEventListener('click', () => {
    initHostRoom(selectedOnlineCapacity);
  });

  document.getElementById('btn-join-online-room').addEventListener('click', () => {
    const code = document.getElementById('join-room-code-input').value;
    if (!code) {
      showToast('⚠️ Masukkan kode ruangan terlebih dahulu!', 'warning');
      return;
    }
    joinOnlineRoom(code);
  });

  // Copy Code
  document.getElementById('btn-copy-room-code').addEventListener('click', () => {
    navigator.clipboard.writeText(mpState.roomCode);
    showToast(`📋 Kode ${mpState.roomCode} berhasil disalin!`, 'success');
  });

  // Share to WhatsApp
  document.getElementById('btn-share-wa').addEventListener('click', () => {
    let url = window.location.href.split('#')[0] + '#room=' + encodeURIComponent(mpState.roomCode);
    const msg = `🎮 Ayo mabar UNO Truth or Dare bersamaku!\n\n🔑 Kode Ruangan: *${mpState.roomCode}*\n🔗 Link: ${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  });

  // Toggle QR Code
  document.getElementById('btn-toggle-qr').addEventListener('click', () => {
    const qrWrap = document.getElementById('lobby-qr-container');
    const isHidden = (qrWrap.style.display === 'none' || !qrWrap.style.display);
    qrWrap.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
      renderLobbyQRCode(mpState.roomCode);
    }
  });

  // Lobby actions
  document.getElementById('btn-leave-lobby').addEventListener('click', closeOnlineLobby);
  document.getElementById('btn-start-online-game').addEventListener('click', startOnlineGameHost);

  document.getElementById('btn-lobby-add-bot').addEventListener('click', () => {
    if (!mpState.isHost) return;
    if (mpState.lobbyPlayers.length >= mpState.maxPlayers) {
      showToast('Ruangan sudah penuh!', 'warning');
      return;
    }
    const botIdx = mpState.lobbyPlayers.filter(p => p.isBot).length;
    const bot = {
      peerId: 'bot_' + Math.random().toString(36).substring(7),
      clientId: 'bot_' + Math.random().toString(36).substring(7),
      name: AI_NAMES[botIdx % AI_NAMES.length],
      avatar: AI_AVATARS[botIdx % AI_AVATARS.length],
      isHost: false,
      isBot: true
    };
    mpState.lobbyPlayers.push(bot);
    addLobbyChatMessage('system', `🤖 ${bot.name} ditambahkan ke ruangan.`);
    mpBroadcastLobbyState();
  });

  // Chat in lobby
  document.getElementById('btn-send-chat').addEventListener('click', sendLobbyChat);
  document.getElementById('lobby-chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendLobbyChat();
  });

  // Auto-fill room code from URL hash (#room=UNO-XXXX)
  if (window.location.hash.includes('room=')) {
    const hashRoom = window.location.hash.split('room=')[1];
    if (hashRoom) {
      document.getElementById('mode-online').click();
      document.getElementById('tab-btn-join-room').click();
      document.getElementById('join-room-code-input').value = decodeURIComponent(hashRoom);
    }
  }
}

function startGameOffline(numPlayers, gameMode) {
  initState(numPlayers, gameMode);
  document.getElementById('online-room-badge').style.display = 'none';
  document.getElementById('header-mode-tag').textContent = (gameMode === 'pass') ? 'Pass & Play' : 'Solo vs AI';
  renderAll();
  showToast(`🎮 Permainan dimulai! ${state.players.length} Pemain. Mode: ${gameMode === 'ai' ? 'Vs AI' : 'Bareng Teman'}`);
  scheduleNextAI();
}

// ─── MAIN INITIALIZATION ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  loadCustomData();
  setupStartScreen();
  updateTodSummaryBadge();

  // Editor Modal Events
  document.getElementById('btn-open-tod-editor').addEventListener('click', openTodEditor);
  document.getElementById('btn-header-tod').addEventListener('click', openTodEditor);
  document.getElementById('btn-close-tod-editor').addEventListener('click', closeTodEditor);
  document.getElementById('btn-cancel-tod').addEventListener('click', closeTodEditor);
  document.getElementById('btn-save-tod').addEventListener('click', saveEditorInputs);

  const tabTruth = document.getElementById('tab-btn-truth');
  const tabDare  = document.getElementById('tab-btn-dare');
  const contentTruth = document.getElementById('tab-content-truth');
  const contentDare  = document.getElementById('tab-content-dare');

  tabTruth.addEventListener('click', () => {
    tabTruth.classList.add('active');
    tabDare.classList.remove('active');
    contentTruth.classList.add('active');
    contentDare.classList.remove('active');
  });

  tabDare.addEventListener('click', () => {
    tabDare.classList.add('active');
    tabTruth.classList.remove('active');
    contentDare.classList.add('active');
    contentTruth.classList.remove('active');
  });

  document.getElementById('btn-preset-fun').addEventListener('click', () => {
    applyPreset(PRESET_FUN_TRUTHS, PRESET_FUN_DARES, 'Seru & Gaul');
  });
  document.getElementById('btn-preset-spicy').addEventListener('click', () => {
    applyPreset(PRESET_SPICY_TRUTHS, PRESET_SPICY_DARES, 'Kocak & Gokil');
  });
  document.getElementById('btn-preset-reset').addEventListener('click', () => {
    applyPreset(DEFAULT_TRUTHS, DEFAULT_DARES, 'Default');
  });

  // Action Bar Buttons
  document.getElementById('btn-draw').addEventListener('click', handleDraw);
  document.getElementById('btn-uno').addEventListener('click', handleUnoButton);
  document.getElementById('btn-combo-mode').addEventListener('click', toggleComboMode);
  document.getElementById('btn-play-combo').addEventListener('click', executePlayCombo);
  document.getElementById('btn-cancel-combo').addEventListener('click', cancelCombo);

  document.getElementById('btn-manual-tod').addEventListener('click', () => {
    if (state.gameOver) return;
    const currP = state.players[state.currentPlayer];
    triggerTruthOrDare(currP, `Tantangan Truth or Dare Pilihan Bebas!`, (completed) => {
      showToast(completed ? `✨ ${currP.name} berhasil melakukan tantangan!` : `${currP.name} menyerah!`);
    });
  });

  // Live Reaction buttons
  document.querySelectorAll('.btn-emoji-reaction').forEach(btn => {
    btn.addEventListener('click', () => triggerLiveReaction(btn.dataset.emoji));
  });

  // Truth or Dare Modal Buttons
  document.getElementById('btn-choose-truth').addEventListener('click', () => handleTodChoice('truth', false));
  document.getElementById('btn-choose-dare').addEventListener('click', () => handleTodChoice('dare', false));
  document.getElementById('btn-tod-complete').addEventListener('click', () => resolveTruthOrDare(true));
  document.getElementById('btn-tod-forfeit').addEventListener('click', () => resolveTruthOrDare(false));
  document.getElementById('btn-bot-continue').addEventListener('click', () => resolveTruthOrDare(true));

  // Color Picker Swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = swatch.dataset.color || swatch.getAttribute('data-color');
      handleColorChoice(color);
    });
  });

  // Winner Screen
  document.getElementById('btn-new-game').addEventListener('click', () => {
    document.getElementById('winner-screen').classList.remove('open');
    document.getElementById('start-screen').style.display = 'flex';
  });
  document.getElementById('btn-edit-tod-postgame').addEventListener('click', () => {
    document.getElementById('winner-screen').classList.remove('open');
    openTodEditor();
  });

  // Close modals on backdrop click
  document.getElementById('color-picker').addEventListener('click', (e) => {
    if (e.target === document.getElementById('color-picker')) closeColorPicker();
  });
  document.getElementById('tod-editor-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('tod-editor-modal')) closeTodEditor();
  });

  // Exit Game Button & Confirm Modal
  document.getElementById('btn-exit-game').addEventListener('click', openExitConfirm);
  document.getElementById('btn-cancel-exit').addEventListener('click', closeExitConfirm);
  document.getElementById('btn-confirm-exit').addEventListener('click', confirmExitGame);
  document.getElementById('exit-confirm-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('exit-confirm-modal')) closeExitConfirm();
  });
});
