import { useState, useEffect, useRef } from "react";

/* ═══════════════════════ DATA ═══════════════════════ */

const CHARS = {
  seah: {
    name: "Yoo Se-ah", korean: "유세아", role: "La Protagoniste",
    desc: "Courageuse et déterminée. Elle n'abandonne jamais ceux qu'elle aime.",
    lore: "Ses instincts la guident là où la logique échoue. Sa loyauté sera son arme… et sa faiblesse.",
    color: "#e85d8a", glow: "rgba(232,93,138,0.35)",
    gradient: "linear-gradient(160deg, #2d0025 0%, #5a003a 60%, #0a0008 100%)",
    icon: "🌸", borderGlow: "#e85d8a"
  },
  geonwoo: {
    name: "Kim Geon-woo", korean: "김건우", role: "Le Protecteur",
    desc: "Fort et loyal. Il ferait n'importe quoi pour protéger ses amis.",
    lore: "Sa force physique est réelle, mais c'est son cœur qui le rend dangereux. Peut-il vraiment sauver tout le monde?",
    color: "#4a9eff", glow: "rgba(74,158,255,0.35)",
    gradient: "linear-gradient(160deg, #001228 0%, #002d70 60%, #0a0008 100%)",
    icon: "⚡", borderGlow: "#4a9eff"
  },
  hajoon: {
    name: "Kang Ha-joon", korean: "강하준", role: "L'Enquêteur",
    desc: "Brillant et méthodique. Sa sœur chamane Ha-sal change tout.",
    lore: "Il approche le surnaturel avec logique. Ha-sal lui donne accès au monde des esprits — un atout incomparable face à Girigo.",
    color: "#b06aff", glow: "rgba(176,106,255,0.35)",
    gradient: "linear-gradient(160deg, #0f0028 0%, #3a0075 60%, #0a0008 100%)",
    icon: "🔮", borderGlow: "#b06aff"
  },
  nari: {
    name: "Lim Na-ri", korean: "임나리", role: "La Rebelle",
    desc: "Passionnée, impulsive. Son chemin est le plus dangereux de tous.",
    lore: "Ses émotions amplifient la malédiction. Jalousie, amour, rage — tout devient une arme. Si-won sait exactement comment la manipuler…",
    color: "#ff6b35", glow: "rgba(255,107,53,0.35)",
    gradient: "linear-gradient(160deg, #200a00 0%, #6a1500 60%, #0a0008 100%)",
    icon: "🔥", borderGlow: "#ff6b35"
  }
};

const SCENES = [
  {
    id: "ch1", chapter: "CHAPITRE I", title: "L'Application",
    situation: `Hyeong-wook t'attrape dans le couloir du lycée Seorin, les yeux brillants. "J'ai souhaité avoir 20 en maths et ça a marché !" Il pousse son téléphone sous ton nez. L'icône de l'application ressemble à un œil rouge qui cligne lentement. Son nom : GIRIGO (기리고). Il t'envoie le lien.`,
    choices: [
      { id: "use_app", icon: "📱", text: "Ouvrir Girigo et faire un vœu", subtext: "Le minuteur rouge commencera immédiatement.", risk: "ÉLEVÉ", riskColor: "#ff3333", effect: { wishFlow: true, timerStart: 120, flag: "used_app" } },
      { id: "warn", icon: "⚠️", text: "Avertir Hyeong-wook du danger", subtext: "Il ne te croira probablement pas.", risk: "FAIBLE", riskColor: "#44ff88", effect: { addTime: 0, flag: "warned_hyeongwook" } },
      { id: "investigate", icon: "🔍", text: "Chercher qui a créé cette application d'abord", subtext: "Ha-joon t'aiderait dans cette recherche.", risk: "MOYEN", riskColor: "#ffaa33", effect: { addTime: 25, flag: "investigated_first" } }
    ]
  },
  {
    id: "ch1b", chapter: "CHAPITRE I", title: "La Mort en Direct",
    situation: `Dans la salle de classe. Hyeong-wook se lève soudainement. Ses yeux deviennent vides — comme si quelqu'un l'avait éteint. Puis il se tranche la gorge devant toute la classe. Les cris remplissent l'air. Le sang éclabousse le sol blanc. Sur ton téléphone, un minuteur rouge s'allume. Il décompte.`,
    choices: [
      { id: "stay", icon: "📞", text: "Appeler les secours et rester sur place", subtext: "La police posera beaucoup de questions.", risk: "MOYEN", riskColor: "#ffaa33", effect: { addTime: 15, flag: "called_police" } },
      { id: "flee", icon: "🏃", text: "Fuir et rassembler tous les amis", subtext: "Plus rapide pour agir — mais la culpabilité reste.", risk: "MOYEN", riskColor: "#ffaa33", effect: { addTime: 20, flag: "gathered_friends" } },
      { id: "examine", icon: "👁️", text: "Regarder le corps de près… quelque chose d'étrange", subtext: "Un fantôme se tient au-dessus du corps. Tu es le seul à le voir.", risk: "ÉLEVÉ", riskColor: "#ff3333", effect: { addTime: -15, flag: "saw_ghost" } }
    ]
  },
  {
    id: "ch2", chapter: "CHAPITRE II", title: "Le Compte à Rebours",
    situation: `Les fantômes te suivent partout dans les couloirs. Personne d'autre ne les voit — seulement ceux qui ont utilisé Girigo. Le minuteur continue. Une ombre noire suit Geon-woo depuis ce matin. Il est la prochaine cible. Il reste peu de temps.`,
    choices: [
      { id: "tell", icon: "👥", text: "Tout révéler à tes amis", subtext: "Ensemble vous êtes plus forts face à la malédiction.", risk: "MOYEN", riskColor: "#ffaa33", effect: { addTime: 20, flag: "friends_know" } },
      { id: "solo", icon: "🔦", text: "Enquêter seul(e) — pour protéger les autres", subtext: "Moins de victimes, mais tu es plus vulnérable.", risk: "ÉLEVÉ", riskColor: "#ff3333", effect: { addTime: -20, flag: "went_solo" } },
      { id: "pass_curse", icon: "😈", text: "Transmettre l'application à quelqu'un d'autre", subtext: "Cela arrête ton minuteur… mais au prix de quelqu'un.", risk: "MORAL", riskColor: "#cc44ff", effect: { resetTimer: 120, flag: "passed_curse", moral: -2 } }
    ]
  },
  {
    id: "ch3", chapter: "CHAPITRE III", title: "La Chamane",
    situation: `Ha-joon t'emmène chez Ha-sal, sa sœur chamane qui communique avec les esprits. Ses yeux voient tout. Elle révèle la vérité : une étudiante nommée Kwon Si-won a créé Girigo avant de se suicider, pour se venger de ceux qui l'avaient poussée à mort. Pour briser la malédiction, il faut détruire son téléphone — qui existe quelque part dans le monde des esprits.`,
    choices: [
      { id: "spirit_world", icon: "🌀", text: "Entrer dans le monde des esprits", subtext: "Voie directe. La plus terrifiante. Ha-sal t'accompagne.", risk: "ÉLEVÉ", riskColor: "#ff3333", effect: { addTime: 50, flag: "entered_spirit_world" } },
      { id: "find_house", icon: "🏚️", text: "Localiser physiquement la maison de Si-won", subtext: "Le téléphone pourrait encore être là-bas.", risk: "MOYEN", riskColor: "#ffaa33", effect: { addTime: 25, flag: "found_house" } },
      { id: "wish_end", icon: "💀", text: "Utiliser Girigo pour souhaiter la fin de la malédiction", subtext: "⚠️ Personne n'a jamais osé tenter ça…", risk: "EXTRÊME", riskColor: "#ff0000", effect: { addTime: -45, flag: "wished_for_end", plotTwist: true } }
    ]
  },
  {
    id: "ch4", chapter: "CHAPITRE IV", title: "La Trahison",
    situation: `Na-ri s'est retournée contre vous. Manipulée par l'esprit de Si-won, elle croit que ses amis la sacrifieraient sans hésiter. Dans ses yeux : quelque chose d'obscur, quelque chose qui n'est plus entièrement elle. Elle se dresse entre toi et le téléphone de Si-won. La flèche de Ha-sal est dans sa main. Le minuteur approche de zéro.`,
    choices: [
      { id: "fight", icon: "⚔️", text: "Affronter Na-ri — elle doit tomber", subtext: "Elle pourrait ne pas s'en sortir vivante.", risk: "ÉLEVÉ", riskColor: "#ff3333", effect: { flag: "fought_nari", ending: "survival" } },
      { id: "talk", icon: "💬", text: "Parler à la vraie Na-ri — elle est encore là", subtext: "Si elle entend ta voix, Si-won pourrait perdre son emprise.", risk: "MOYEN", riskColor: "#ffaa33", effect: { flag: "talked_nari", ending: "redemption" } },
      { id: "sacrifice", icon: "💀", text: "Te sacrifier pour que les autres s'échappent", subtext: "Tu mourras. Mais tout le monde survivra.", risk: "MORTEL", riskColor: "#8b0000", effect: { flag: "sacrificed", ending: "sacrifice" } }
    ]
  }
];

const ENDINGS = {
  survival: {
    title: "SURVIE", korean: "생존", color: "#4a9eff",
    bg: "radial-gradient(ellipse at 50% 30%, #001a40 0%, #000508 80%)",
    prompt: `Le joueur a affronté Na-ri dans le monde des esprits. Na-ri est morte. Le téléphone de Si-won a été détruit par une flèche. La malédiction est brisée. Les survivants — Se-ah, Geon-woo et Ha-joon — vivent avec la culpabilité. Ha-sal organise une cérémonie pour Hyeong-wook et Na-ri. ÉPILOGUE: un élève inconnu trouve le téléphone abandonné de Na-ri sur le campus. Un message Discord lui envoie le code de déverrouillage. L'application Girigo est encore installée.`
  },
  redemption: {
    title: "RÉDEMPTION", korean: "구원", color: "#ffc83d",
    bg: "radial-gradient(ellipse at 50% 30%, #2a1800 0%, #080400 80%)",
    prompt: `Le joueur a trouvé les mots justes. La vraie Na-ri a entendu sa voix. L'emprise de Si-won s'est brisée. Ensemble ils ont détruit le téléphone. Na-ri survit, profondément changée. La malédiction est brisée. Mais l'ÉPILOGUE révèle que plusieurs copies de Girigo circulent déjà sur Internet. Le cycle recommencera ailleurs — avec d'autres élèves innocents.`
  },
  sacrifice: {
    title: "SACRIFICE", korean: "희생", color: "#e85d8a",
    bg: "radial-gradient(ellipse at 50% 30%, #2d0018 0%, #080003 80%)",
    prompt: `Le joueur s'est sacrifié. Na-ri a été libérée de la possession. Geon-woo, Ha-joon et Na-ri survivent. Ha-sal organise une cérémonie pour trois âmes: Hyeong-wook, le joueur, et Si-won enfin libérée de sa rage. Dans l'ÉPILOGUE: les survivants reçoivent un dernier message d'un numéro inconnu. C'est le dernier vœu jamais entré dans Girigo — le vœu secret du joueur avant le sacrifice.`
  },
  death: {
    title: "FIN PRÉMATURÉE", korean: "죽음", color: "#8b0000",
    bg: "radial-gradient(ellipse at 50% 30%, #1a0000 0%, #020000 80%)",
    prompt: `Le minuteur de Girigo a atteint zéro. L'esprit de Si-won envahit le joueur. Dans un brouillard de conscience, il voit ses amis crier son prénom. Puis le noir. Dans l'ÉPILOGUE: quelqu'un utilise le compte Discord du joueur pour contacter un nouvel élève de Seorin. Le message contient un lien. L'icône est un œil rouge qui cligne.`
  }
};

/* ═══════════════════════ API ════════════════════════ */

async function callClaude(situation, charKey, prevChoices) {
  const char = CHARS[charKey];
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `Tu es le narrateur d'un visual novel d'horreur coréen basé sur "If Wishes Could Kill" (기리고, Netflix 2026 — lycée Seorin, application Girigo qui exauce des vœux mais déclenche un minuteur de mort, esprits vengeurs de Si-won).
Le joueur incarne ${char ? char.name + " (" + char.korean + "), " + char.role : "un élève de Seorin"}.
Style: horreur psychologique coréenne, suspense viscéral, atmosphère surnaturelle. Tutoie le joueur. Sois dramatique, immersif, poétique — comme une scène de kdrama. 
IMPORTANT: 80-100 mots maximum. Ne donne pas les choix. Termine par une phrase qui met le joueur face à l'action.
Choix précédents du joueur: ${prevChoices.length ? prevChoices.map(c => c.id).join(", ") : "aucun"}.`,
        messages: [{ role: "user", content: situation }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || situation;
  } catch {
    return situation;
  }
}

/* ═══════════════════════ HOOKS ══════════════════════ */

function useTypewriter(text, speed = 22) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return { shown, done };
}

/* ═══════════════════════ COMPONENT ══════════════════ */

export default function IfWishesCouldKill() {
  const [screen, setScreen] = useState("title");
  const [charKey, setCharKey] = useState(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [flags, setFlags] = useState({});
  const [timerSec, setTimerSec] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [moral, setMoral] = useState(0);
  const [endingKey, setEndingKey] = useState(null);
  const [endingText, setEndingText] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishFlow, setWishFlow] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const timerRef = useRef(null);
  const { shown, done } = useTypewriter(narrative, 18);

  /* Timer */
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!timerActive || timerSec === null) return;
    timerRef.current = setInterval(() => {
      setTimerSec(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimerZero();
          return 0;
        }
        if (prev <= 25) setGlitch(g => !g);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const handleTimerZero = async () => {
    setTimerActive(false); setGlitch(false);
    setEndingKey("death"); setScreen("ending"); setLoading(true);
    const t = await callClaude("Le minuteur de Girigo atteint zéro. L'esprit de Si-won envahit le joueur. Scène de possession dramatique. 70 mots.", charKey, history);
    setEndingText(t); setLoading(false);
  };

  /* Load scene with Claude narrative */
  const loadScene = async (idx, hist) => {
    const scene = SCENES[idx];
    setLoading(true); setChoicesVisible(false); setNarrative("");
    const t = await callClaude(scene.situation, charKey, hist || history);
    setNarrative(t); setLoading(false);
    setTimeout(() => setChoicesVisible(true), 500);
  };

  const startGame = async (key) => {
    setCharKey(key); setScreen("game"); setSceneIdx(0);
    setHistory([]); setFlags({}); setMoral(0);
    setTimerSec(null); setTimerActive(false);
    setLoading(true); setChoicesVisible(false); setNarrative("");
    const t = await callClaude(SCENES[0].situation, key, []);
    setNarrative(t); setLoading(false);
    setTimeout(() => setChoicesVisible(true), 500);
  };

  const handleChoice = async (choice) => {
    setChoicesVisible(false);
    const newFlags = { ...flags, [choice.effect.flag]: true };
    setFlags(newFlags);
    if (choice.effect.moral) setMoral(m => m + choice.effect.moral);

    // Timer logic
    if (choice.effect.wishFlow) { setWishFlow(true); setTimerSec(choice.effect.timerStart); return; }
    if (choice.effect.timerStart) { setTimerSec(choice.effect.timerStart); setTimerActive(true); }
    if (choice.effect.addTime && timerSec !== null) setTimerSec(s => Math.max(5, s + choice.effect.addTime));
    if (choice.effect.resetTimer) { setTimerSec(choice.effect.resetTimer); }

    const newHist = [...history, choice];
    setHistory(newHist);

    if (choice.effect.ending) { await goToEnding(choice.effect.ending, newHist); return; }

    const next = sceneIdx + 1;
    if (next < SCENES.length) { setSceneIdx(next); await loadScene(next, newHist); }
  };

  const submitWish = async () => {
    setWishFlow(false);
    setTimerActive(true);
    setLoading(true); setNarrative("");
    const t = await callClaude(
      `Le joueur vient de faire son vœu dans Girigo: "${wishText || "un vœu secret"}". L'application confirme avec une animation rouge sang. Immédiatement, un minuteur rouge clignote sur l'écran. La malédiction commence. 80 mots dramatiques.`,
      charKey, history
    );
    setNarrative(t); setLoading(false);
    setTimeout(async () => {
      const next = sceneIdx + 1;
      if (next < SCENES.length) { setSceneIdx(next); await loadScene(next, history); }
    }, 3500);
  };

  const goToEnding = async (key, hist) => {
    clearInterval(timerRef.current);
    setTimerActive(false); setGlitch(false);
    setEndingKey(key); setScreen("ending"); setLoading(true);
    const t = await callClaude(ENDINGS[key].prompt, charKey, hist || history);
    setEndingText(t); setLoading(false);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setScreen("title"); setCharKey(null); setSceneIdx(0); setNarrative("");
    setLoading(false); setHistory([]); setFlags({}); setTimerSec(null);
    setTimerActive(false); setMoral(0); setEndingKey(null); setEndingText("");
    setWishText(""); setWishFlow(false); setChoicesVisible(false); setGlitch(false);
  };

  const scene = SCENES[sceneIdx];
  const char = charKey ? CHARS[charKey] : null;
  const ending = endingKey ? ENDINGS[endingKey] : null;
  const maxTimer = 120;
  const timerPct = timerSec !== null ? timerSec / maxTimer : 1;
  const timerUrgent = timerSec !== null && timerSec <= 20;
  const timerColor = timerPct > 0.5 ? "#ff4455" : timerPct > 0.2 ? "#ff7733" : "#ff1122";
  const circumference = 2 * Math.PI * 18;

  return (
    <div style={{ minHeight: "100vh", background: "#030006", fontFamily: "'Noto Serif KR', Georgia, serif", color: "#ddc8f0", position: "relative", overflow: "hidden" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;900&family=Orbitron:wght@400;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes floatUp{0%{transform:translateY(100vh) scale(0);opacity:0}10%{opacity:0.8}90%{opacity:0.2}100%{transform:translateY(-10vh) translateX(var(--dx)) scale(1.5);opacity:0}}
        @keyframes pulse{0%,100%{box-shadow:0 0 8px rgba(180,0,40,0.4)}50%{box-shadow:0 0 28px rgba(255,0,50,0.8),0 0 55px rgba(180,0,30,0.4)}}
        @keyframes glitch{0%{transform:translate(0);filter:none}25%{transform:translate(-3px,1px);filter:hue-rotate(80deg) saturate(2)}50%{transform:translate(3px,-1px);filter:hue-rotate(-80deg)}75%{transform:translate(-2px,2px);filter:contrast(1.8)}100%{transform:translate(0);filter:none}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
        @keyframes flicker{0%,89%,91%,93%,100%{opacity:1}90%,92%{opacity:0.7}}
        @keyframes revealCard{from{opacity:0;transform:translateY(30px) rotateX(-8deg)}to{opacity:1;transform:translateY(0) rotateX(0)}}
        @keyframes scanline{from{transform:translateY(-4px)}to{transform:translateY(4px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .glitch-fx{animation:glitch 0.12s steps(1) infinite}
        .breathe{animation:breathe 3s ease-in-out infinite}
        .flicker{animation:flicker 5s infinite}
        .pulse{animation:pulse 1.2s ease-in-out infinite}
        .btn-choice{background:rgba(12,3,18,0.75);border:1px solid rgba(140,0,45,0.3);color:#d8c0e8;padding:14px 18px;border-radius:5px;cursor:pointer;transition:all 0.2s ease;width:100%;text-align:left;display:flex;gap:14px;align-items:flex-start;backdrop-filter:blur(12px);opacity:0;animation:fadeIn 0.4s ease forwards}
        .btn-choice:hover{background:rgba(60,0,35,0.85);border-color:rgba(230,50,100,0.55);transform:translateX(5px);box-shadow:-5px 0 24px rgba(180,0,45,0.35)}
        .char-card{background:rgba(8,0,12,0.6);border:1px solid rgba(140,0,45,0.2);border-radius:10px;padding:22px 18px;cursor:pointer;transition:all 0.3s ease;backdrop-filter:blur(14px);opacity:0;animation:revealCard 0.55s ease forwards}
        .char-card:hover{transform:translateY(-10px) scale(1.03)}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#030006}::-webkit-scrollbar-thumb{background:#4a0020;border-radius:2px}
        input::placeholder{color:rgba(255,80,80,0.4)}
      `}</style>

      {/* ── BG PARTICLES ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: i % 4 === 0 ? "3px" : "2px", height: i % 4 === 0 ? "3px" : "2px", background: ["#6b0020", "#4a0015", "#900030", "#3a000f"][i % 4], borderRadius: "50%", left: `${(i * 7 + 4) % 100}%`, bottom: -4, "--dx": `${(i % 2 === 0 ? 1 : -1) * (15 + i * 6)}px`, animation: `floatUp ${7 + i * 0.9}s ease-in infinite`, animationDelay: `${i * 0.65}s` }} />
        ))}
      </div>
      {/* Scanlines */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)" }} />
      {glitch && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99, background: "rgba(255,0,0,0.06)" }} />}

      {/* ════════ TITLE SCREEN ════════ */}
      {screen === "title" && (
        <div className={glitch ? "glitch-fx" : ""} style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "#5a1530", letterSpacing: 8, fontFamily: "Orbitron, monospace", marginBottom: 10 }}>NETFLIX × SEORIN HIGH SCHOOL × 기리고</p>

          <h1 className="flicker" style={{ fontSize: "clamp(38px,9vw,80px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: 2, background: "linear-gradient(135deg, #ff1a1a 0%, #cc0040 50%, #7a0020 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
            IF WISHES<br />COULD KILL
          </h1>
          <p style={{ fontSize: 12, color: "#6a2035", letterSpacing: 7, fontFamily: "Orbitron, monospace", marginBottom: 56 }}>LE JEU INTERACTIF</p>

          {/* Phone mockup */}
          <div className="breathe" style={{ width: 170, height: 300, background: "linear-gradient(160deg,#08000e,#120020)", border: "2px solid rgba(160,0,45,0.45)", borderRadius: 24, marginBottom: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 0 80px rgba(120,0,35,0.25), inset 0 0 40px rgba(80,0,20,0.2)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "radial-gradient(ellipse at 35% 25%, rgba(255,0,0,0.12), transparent 55%)" }} />
            {/* Crack */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 170 300">
              <path d="M85,0 L90,70 L115,110 L105,200 L125,300" stroke="rgba(255,0,0,0.25)" strokeWidth="1" fill="none" />
              <path d="M90,70 L65,120 L75,170" stroke="rgba(255,0,0,0.15)" strokeWidth="0.5" fill="none" />
            </svg>
            <div style={{ fontSize: 44, marginBottom: 14 }}>👁️</div>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 22, fontWeight: 700, color: "#ff1a33", letterSpacing: 5, textShadow: "0 0 25px rgba(255,26,51,0.7)" }}>GIRIGO</div>
            <div style={{ fontSize: 12, color: "#7a2035", marginTop: 6, letterSpacing: 3 }}>기리고</div>
            <div style={{ position: "absolute", bottom: 16, fontSize: 9, color: "#550018", fontFamily: "Orbitron, monospace", letterSpacing: 1, padding: "0 12px", textAlign: "center" }}>"Got a wish worth dying for?"</div>
          </div>

          <button onClick={() => setScreen("charSelect")} style={{ background: "transparent", border: "1px solid rgba(180,0,50,0.55)", color: "#ff4466", padding: "14px 52px", fontSize: 12, letterSpacing: 7, fontFamily: "Orbitron, monospace", cursor: "pointer", transition: "all 0.3s", borderRadius: 2, marginBottom: 32 }}
            onMouseEnter={e => { e.target.style.background = "rgba(90,0,28,0.55)"; e.target.style.borderColor = "#ff1a33"; e.target.style.boxShadow = "0 0 35px rgba(160,0,35,0.4)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(180,0,50,0.55)"; e.target.style.boxShadow = "none"; }}>
            COMMENCER →
          </button>
          <p style={{ fontSize: 10, color: "#3a0f18", letterSpacing: 3, fontFamily: "Orbitron, monospace" }}>⚠️ CONTENU SENSIBLE · HORREUR PSYCHOLOGIQUE · 16+</p>
        </div>
      )}

      {/* ════════ CHARACTER SELECT ════════ */}
      {screen === "charSelect" && (
        <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", padding: "40px 20px", maxWidth: 920, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 10, color: "#5a1530", letterSpacing: 7, fontFamily: "Orbitron, monospace", marginBottom: 12 }}>LYCÉE SEORIN — CHOISISSEZ VOTRE DESTIN</p>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#e0c0d8", marginBottom: 10 }}>Qui êtes-vous ?</h2>
            <p style={{ color: "#7a4560", fontSize: 13, maxWidth: 500, margin: "0 auto" }}>Chaque personnage suit une route différente. Un seul choix vous appartient.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: 18 }}>
            {Object.entries(CHARS).map(([key, c], i) => (
              <div key={key} className="char-card" style={{ background: c.gradient, animationDelay: `${i * 0.13}s`, "--hover-glow": c.glow }} onClick={() => startGame(key)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.boxShadow = `0 22px 65px ${c.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(140,0,45,0.2)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 42, textAlign: "center", marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontSize: 9, color: c.color, letterSpacing: 4, fontFamily: "Orbitron, monospace", textAlign: "center", marginBottom: 4 }}>{c.role}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#f0e0f8", textAlign: "center", marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: c.color, opacity: 0.65, textAlign: "center", marginBottom: 12 }}>{c.korean}</div>
                <div style={{ fontSize: 12, color: "#b090c0", lineHeight: 1.55, marginBottom: 10 }}>{c.desc}</div>
                <div style={{ fontSize: 11, color: "#7a5a70", fontStyle: "italic", lineHeight: 1.45, marginBottom: 16 }}>{c.lore}</div>
                <button style={{ width: "100%", padding: "9px", background: `${c.color}18`, border: `1px solid ${c.color}33`, color: c.color, borderRadius: 4, cursor: "pointer", fontFamily: "Orbitron, monospace", fontSize: 10, letterSpacing: 3 }}>
                  CHOISIR →
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => setScreen("title")} style={{ background: "none", border: "none", color: "#4a1525", fontSize: 11, fontFamily: "Orbitron, monospace", letterSpacing: 4, cursor: "pointer" }}>← RETOUR</button>
          </div>
        </div>
      )}

      {/* ════════ GAME SCREEN ════════ */}
      {screen === "game" && scene && (
        <div className={glitch ? "glitch-fx" : ""} style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(140,0,40,0.2)", background: "rgba(3,0,6,0.85)", backdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 20 }}>
            <div>
              <div style={{ fontSize: 8, color: "#550020", letterSpacing: 5, fontFamily: "Orbitron, monospace" }}>{scene.chapter}</div>
              <div style={{ fontSize: 14, color: "#c8a8e0", fontWeight: 600 }}>{scene.title}</div>
            </div>
            {char && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 8, color: char.color, opacity: 0.7, letterSpacing: 3, fontFamily: "Orbitron, monospace" }}>{char.role}</div>
                  <div style={{ fontSize: 12, color: char.color }}>{char.icon} {char.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Timer bar */}
          {timerSec !== null && (
            <div className={timerUrgent ? "pulse" : ""} style={{ padding: "10px 22px", background: `rgba(${timerUrgent ? "70,0,0" : "20,0,12"},0.9)`, borderBottom: `1px solid ${timerUrgent ? "rgba(255,0,0,0.45)" : "rgba(80,0,25,0.3)"}`, display: "flex", alignItems: "center", gap: 14 }}>
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,0,0,0.15)" strokeWidth="3" />
                <circle cx="22" cy="22" r="18" fill="none" stroke={timerColor} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={circumference * (1 - timerSec / maxTimer)}
                  transform="rotate(-90 22 22)" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                <text x="22" y="27" textAnchor="middle" fill={timerColor} fontSize="12" fontFamily="Orbitron">{timerSec}</text>
              </svg>
              <div>
                <div style={{ fontSize: 8, color: timerColor, letterSpacing: 5, fontFamily: "Orbitron, monospace" }}>GIRIGO · MINUTEUR ACTIF</div>
                <div style={{ fontSize: 12, color: timerUrgent ? "#ff4455" : "#aa3344" }}>
                  {timerUrgent ? "⚠️ L'esprit de Si-won se referme sur toi…" : "Si le minuteur atteint zéro, c'est la mort."}
                </div>
              </div>
            </div>
          )}

          {/* Main */}
          <div style={{ flex: 1, padding: "28px 22px", maxWidth: 720, margin: "0 auto", width: "100%" }}>

            {/* Narrative box */}
            <div style={{ background: "rgba(8,0,14,0.65)", border: "1px solid rgba(90,0,35,0.3)", borderRadius: 8, padding: "26px 28px", marginBottom: 26, minHeight: 150, position: "relative", backdropFilter: "blur(14px)" }}>
              <div style={{ position: "absolute", top: -1, left: -1, width: 18, height: 18, borderTop: "2px solid #7a0028", borderLeft: "2px solid #7a0028" }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 18, height: 18, borderBottom: "2px solid #7a0028", borderRight: "2px solid #7a0028" }} />
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#550020" }}>
                  <div className="breathe" style={{ fontSize: 30, marginBottom: 12 }}>👁️</div>
                  <div style={{ fontFamily: "Orbitron, monospace", fontSize: 10, letterSpacing: 5 }}>GIRIGO SE SOUVIENT…</div>
                </div>
              ) : (
                <p style={{ fontSize: 15, lineHeight: 1.9, color: "#cdb4e0", margin: 0, fontStyle: "italic" }}>
                  {shown}
                  {!done && <span style={{ color: "#7a0030", animation: "flicker 0.8s infinite" }}>█</span>}
                </p>
              )}
            </div>

            {/* WISH FLOW */}
            {wishFlow && (
              <div style={{ background: "rgba(4,0,7,0.96)", border: "1px solid rgba(200,0,50,0.5)", borderRadius: 8, padding: "30px 26px", marginBottom: 22, textAlign: "center", animation: "fadeIn 0.5s ease", boxShadow: "0 0 80px rgba(140,0,30,0.25)" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>👁️</div>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: 22, fontWeight: 700, color: "#ff1a33", letterSpacing: 5, marginBottom: 6, textShadow: "0 0 30px rgba(255,26,51,0.65)" }}>GIRIGO</div>
                <div style={{ fontSize: 11, color: "#7a2030", marginBottom: 22, letterSpacing: 3 }}>기리고 · Quel est ton vœu ?</div>
                <input value={wishText} onChange={e => setWishText(e.target.value)} onKeyDown={e => e.key === "Enter" && submitWish()} placeholder="Tape ton vœu ici…"
                  style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,50,50,0.5)", color: "#ff8888", fontFamily: "'Noto Serif KR', serif", fontSize: 17, padding: "8px 0", width: "100%", outline: "none", textAlign: "center", marginBottom: 8 }} />
                <div style={{ fontSize: 10, color: "#440015", marginTop: 8, marginBottom: 22, letterSpacing: 2 }}>⚠️ Tout vœu a un prix. Le minuteur commence maintenant.</div>
                <button onClick={submitWish} style={{ background: "linear-gradient(135deg,#2a000e,#650018)", border: "1px solid rgba(200,0,50,0.55)", color: "#ff3355", padding: "12px 38px", borderRadius: 4, cursor: "pointer", fontFamily: "Orbitron, monospace", fontSize: 11, letterSpacing: 5 }}>
                  EXAUCER →
                </button>
              </div>
            )}

            {/* Choices */}
            {choicesVisible && done && !loading && !wishFlow && (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ fontSize: 9, color: "#440018", letterSpacing: 5, fontFamily: "Orbitron, monospace", marginBottom: 2 }}>CHOISISSEZ UNE ACTION</div>
                {scene.choices.map((c, i) => (
                  <button key={c.id} className="btn-choice" style={{ animationDelay: `${i * 0.1}s` }} onClick={() => handleChoice(c)}>
                    <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, marginBottom: 3, color: "#d0b8e8" }}>{c.text}</div>
                      <div style={{ fontSize: 11, color: "#7a5070" }}>{c.subtext}</div>
                    </div>
                    <div style={{ fontSize: 8, color: c.riskColor, fontFamily: "Orbitron, monospace", letterSpacing: 1, flexShrink: 0, textAlign: "right", paddingTop: 2, opacity: 0.9 }}>{c.risk}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 36 }}>
              {SCENES.map((s, i) => (
                <div key={s.id} style={{ width: i === sceneIdx ? 22 : 6, height: 6, borderRadius: 3, background: i < sceneIdx ? "#7a0025" : i === sceneIdx ? "#ff1a33" : "rgba(90,0,30,0.3)", transition: "all 0.35s" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ ENDING SCREEN ════════ */}
      {screen === "ending" && ending && (
        <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", background: ending.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 22px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: ending.color, letterSpacing: 7, fontFamily: "Orbitron, monospace", marginBottom: 10, opacity: 0.65 }}>{ending.korean}</div>
          <h2 className="flicker" style={{ fontSize: "clamp(40px,10vw,72px)", fontWeight: 900, color: ending.color, letterSpacing: 5, marginBottom: 36, textShadow: `0 0 50px ${ending.color}70` }}>
            {ending.title}
          </h2>

          <div style={{ maxWidth: 620, background: "rgba(0,0,0,0.45)", border: `1px solid ${ending.color}33`, borderRadius: 9, padding: "30px 28px", marginBottom: 42, backdropFilter: "blur(14px)" }}>
            {loading ? (
              <div className="breathe" style={{ color: ending.color, fontFamily: "Orbitron, monospace", fontSize: 11, letterSpacing: 4 }}>FIN EN COURS…</div>
            ) : (
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "#ddc0d8", fontStyle: "italic", margin: 0 }}>{endingText}</p>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28, marginBottom: 44, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: ending.color }}>{history.length}</div>
              <div style={{ fontSize: 9, color: "#6a4050", letterSpacing: 3, fontFamily: "Orbitron, monospace" }}>CHOIX EFFECTUÉS</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26 }}>{moral < -1 ? "😈" : moral > 0 ? "😇" : "⚖️"}</div>
              <div style={{ fontSize: 9, color: "#6a4050", letterSpacing: 3, fontFamily: "Orbitron, monospace" }}>CONSCIENCE</div>
            </div>
            {char && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26 }}>{char.icon}</div>
                <div style={{ fontSize: 9, color: char.color, letterSpacing: 2, fontFamily: "Orbitron, monospace" }}>{char.name.toUpperCase()}</div>
              </div>
            )}
          </div>

          <button onClick={reset} style={{ background: "transparent", border: `1px solid ${ending.color}66`, color: ending.color, padding: "13px 50px", fontSize: 11, letterSpacing: 7, fontFamily: "Orbitron, monospace", cursor: "pointer", borderRadius: 2, transition: "all 0.3s" }}
            onMouseEnter={e => { e.target.style.background = `${ending.color}22`; e.target.style.boxShadow = `0 0 30px ${ending.color}44`; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.boxShadow = "none"; }}>
            RECOMMENCER →
          </button>

          <p style={{ marginTop: 28, fontSize: 9, color: "#3a0f1a", letterSpacing: 3, fontFamily: "Orbitron, monospace" }}>
            {history.some(c => c.effect.flag === "passed_curse") ? "⚠️ La malédiction que tu as transmise continue quelque part…" : "L'histoire de Girigo n'est pas terminée."}
          </p>
        </div>
      )}
    </div>
  );
}
