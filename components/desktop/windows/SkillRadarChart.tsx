import type { TechSkill } from "@/lib/data";

const LEVELS = 4;
const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.32;
const LABEL_RADIUS = RADIUS * 1.38;

function pointAt(angle: number, radius: number) {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export default function SkillRadarChart({
  skills,
  maxScore,
}: {
  skills: TechSkill[];
  maxScore: number;
}) {
  const angleStep = (Math.PI * 2) / skills.length;
  const angleFor = (index: number) => -Math.PI / 2 + index * angleStep;

  const gridPolygons = Array.from({ length: LEVELS }, (_, levelIndex) => {
    const levelRadius = (RADIUS * (levelIndex + 1)) / LEVELS;
    return skills
      .map((_, i) => {
        const { x, y } = pointAt(angleFor(i), levelRadius);
        return `${x},${y}`;
      })
      .join(" ");
  });

  const dataPoints = skills.map((skill, i) =>
    pointAt(angleFor(i), (RADIUS * Math.min(skill.score, maxScore)) / maxScore),
  );
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="overflow-visible"
    >
      {gridPolygons.map((points, i) => (
        <polygon key={i} points={points} className="fill-none stroke-border" />
      ))}
      {skills.map((skill, i) => {
        const { x, y } = pointAt(angleFor(i), RADIUS);
        return (
          <line
            key={skill.name}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            className="stroke-border"
          />
        );
      })}
      <polygon
        points={dataPolygon}
        className="fill-accent/20 stroke-accent"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={skills[i].name} cx={p.x} cy={p.y} r={3.5} className="fill-accent" />
      ))}
      {skills.map((skill, i) => {
        const angle = angleFor(i);
        const { x, y } = pointAt(angle, LABEL_RADIUS);
        const cos = Math.cos(angle);
        const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
        return (
          <text
            key={skill.name}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-foreground text-[11px] font-semibold"
          >
            {skill.name}
          </text>
        );
      })}
    </svg>
  );
}
