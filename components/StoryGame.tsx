"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import StoryAvatar from "@/components/StoryAvatar";
import { speakerInfo, type Story } from "@/lib/stories";

type Line = { kind: "story"; who: string; text: string } | { kind: "me"; text: string };

// Format « Je choisis » : l'histoire avance selon les choix, avec une explication après chaque réponse.
export default function StoryGame({ story, onDone }: { story: Story; onDone: () => void }) {
  const nodes = story.jeu.nodes;
  const [current, setCurrent] = useState(story.jeu.start);
  const [log, setLog] = useState<Line[]>([]);
  const [steps, setSteps] = useState(0);
  const bottom = useRef<HTMLDivElement>(null);
  const node = nodes[current];

  useEffect(() => {
    if (node.end) onDone();
  }, [node.end, onDone]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [current]);

  function choose(label: string, next: string) {
    setLog((lines) => [...lines, { kind: "story", who: node.who, text: node.text }, { kind: "me", text: label }]);
    setSteps((n) => n + 1);
    setCurrent(next);
  }

  function restart() {
    setLog([]);
    setSteps(0);
    setCurrent(story.jeu.start);
  }

  return (
    <section className="story-game" aria-label={`Histoire à choix : ${story.titre}`}>
      <div className="game-log" aria-live="polite">
        {log.map((line, index) =>
          line.kind === "me" ? (
            <div key={index} className="msg user">
              <div className="bubble user">{line.text}</div>
            </div>
          ) : (
            <div key={index} className="msg bot">
              <span className="avatar">
                <StoryAvatar who={line.who as never} size={38} />
              </span>
              <div className="col">
                <p className="who-name">{speakerInfo(line.who as never).name}</p>
                <div className="bubble bot">{line.text}</div>
              </div>
            </div>
          ),
        )}

        <div className="msg bot pop-in" key={current}>
          <span className="avatar">
            <StoryAvatar who={node.who} size={38} />
          </span>
          <div className="col">
            <p className="who-name">{speakerInfo(node.who).name}</p>
            <div className="bubble bot">{node.text}</div>
          </div>
        </div>
        <div ref={bottom} />
      </div>

      {node.choices && (
        <div className="choices">
          <p className="muted">Que fais-tu ?</p>
          {node.choices.map((choice) => (
            <button key={choice.label} type="button" className="example" onClick={() => choose(choice.label, choice.next)}>
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {node.end && (
        <div className="story-end panel">
          <p className="eyebrow">Bravo, tu as terminé en {steps + 1} étapes</p>
          <h2>{node.lesson ?? story.lecon}</h2>
          <div className="row">
            <Link className="btn indigo" href={story.action.href}>
              <Icon name="pin" size={18} />
              {story.action.label}
            </Link>
            <button type="button" className="btn ghost" onClick={restart}>
              Essayer d'autres choix
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
