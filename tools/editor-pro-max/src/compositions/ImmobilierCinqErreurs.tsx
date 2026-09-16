import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {GridPattern} from "../components/backgrounds/GridPattern";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {loadDefaultFonts} from "../presets/fonts";

loadDefaultFonts();

// Inter loads from Google Fonts when the network allows it; the rest of the
// stack keeps the design intact when it doesn't (sandboxes, CI, offline).
const FONT = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const BG_COLORS = ["#0B1220", "#1A2C4E"] as const;
const ACCENT = "#F5A524";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255, 255, 255, 0.64)";

// 20s at 30fps. Frame budget: hook + 5 cards + CTA = 600.
export const HOOK_FRAMES = 95;
export const CARD_FRAMES = 82;
export const CTA_FRAMES = 95;
export const MISTAKE_COUNT = 5;
export const TOTAL_FRAMES =
  HOOK_FRAMES + CARD_FRAMES * MISTAKE_COUNT + CTA_FRAMES;

interface Mistake {
  title: string;
  detail: string;
}

const MISTAKES: Mistake[] = [
  {title: "Visiter une seule fois", detail: "Reviens le soir, et en semaine."},
  {title: "Oublier les frais annexes", detail: "Notaire, travaux, taxe foncière : +10 %."},
  {title: "Négliger les diagnostics", detail: "DPE, toiture, humidité. La facture pique."},
  {title: "Offrir sans accord de prêt", detail: "Sans financement validé, ton offre ne pèse rien."},
  {title: "Acheter au coup de cœur", detail: "Compare trois biens. Toujours."},
];

/** Fades a scene out over its last `frames` frames so cards don't hard-cut. */
const useExitFade = (sceneLength: number, frames = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [sceneLength - frames, sceneLength], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const Scene: React.FC<{opacity: number; children: React.ReactNode}> = ({
  opacity,
  children,
}) => (
  <AbsoluteFill
    style={{
      opacity,
      padding: "96px 88px",
      justifyContent: "center",
      fontFamily: FONT,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const lift = interpolate(enter, [0, 1], [46, 0]);
  const subOpacity = interpolate(frame, [16, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = useExitFade(HOOK_FRAMES);

  return (
    <Scene opacity={exit}>
      <div
        style={{
          opacity: enter,
          transform: `translateY(${lift}px)`,
        }}
      >
        <div
          style={{
            color: ACCENT,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 28,
          }}
        >
          ACHAT IMMOBILIER
        </div>
        <div
          style={{
            color: TEXT,
            fontSize: 122,
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          5 erreurs
          <br />
          qui coûtent
          <br />
          cher.
        </div>
      </div>
      <div
        style={{
          opacity: subOpacity,
          color: MUTED,
          fontSize: 40,
          fontWeight: 500,
          marginTop: 40,
        }}
      >
        À vérifier avant de signer.
      </div>
    </Scene>
  );
};

const MistakeCard: React.FC<{index: number; mistake: Mistake}> = ({
  index,
  mistake,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 16, stiffness: 130}});
  const lift = interpolate(enter, [0, 1], [40, 0]);
  const ruleWidth = interpolate(frame, [8, 26], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const detailOpacity = interpolate(frame, [14, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = useExitFade(CARD_FRAMES);

  return (
    <Scene opacity={exit}>
      <div style={{opacity: enter, transform: `translateY(${lift}px)`}}>
        <div
          style={{
            color: ACCENT,
            fontSize: 150,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -6,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div
          style={{
            color: TEXT,
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -2,
            marginTop: 18,
          }}
        >
          {mistake.title}
        </div>
      </div>
      <div
        style={{
          width: ruleWidth,
          height: 6,
          borderRadius: 3,
          backgroundColor: ACCENT,
          margin: "34px 0",
        }}
      />
      <div
        style={{
          opacity: detailOpacity,
          color: MUTED,
          fontSize: 40,
          fontWeight: 500,
          lineHeight: 1.35,
        }}
      >
        {mistake.detail}
      </div>
    </Scene>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 110}});
  const lift = interpolate(enter, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene opacity={1}>
      <div style={{opacity: enter, transform: `translateY(${lift}px)`}}>
        <div
          style={{
            color: ACCENT,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 28,
          }}
        >
          5 / 5
        </div>
        <div
          style={{
            color: TEXT,
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Enregistre
          <br />
          ce post.
        </div>
      </div>
      <div
        style={{
          opacity: subOpacity,
          color: MUTED,
          fontSize: 40,
          fontWeight: 500,
          marginTop: 36,
          lineHeight: 1.35,
        }}
      >
        Tu le reliras avant ta prochaine visite.
      </div>
    </Scene>
  );
};

export const ImmobilierCinqErreurs: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BG_COLORS[0]}}>
      <GradientBackground
        colors={BG_COLORS}
        angle={155}
        animateAngle
        animateSpeed={0.06}
      />
      <GridPattern
        type="dots"
        spacing={56}
        size={2}
        color="rgba(255,255,255,0.10)"
        animate
        animateSpeed={0.2}
      />

      <Sequence durationInFrames={HOOK_FRAMES}>
        <Hook />
      </Sequence>

      {MISTAKES.map((mistake, i) => (
        <Sequence
          key={mistake.title}
          from={HOOK_FRAMES + i * CARD_FRAMES}
          durationInFrames={CARD_FRAMES}
        >
          <MistakeCard index={i} mistake={mistake} />
        </Sequence>
      ))}

      <Sequence
        from={HOOK_FRAMES + MISTAKE_COUNT * CARD_FRAMES}
        durationInFrames={CTA_FRAMES}
      >
        <Cta />
      </Sequence>

      <ProgressBar color={ACCENT} height={8} position="bottom" />
    </AbsoluteFill>
  );
};
