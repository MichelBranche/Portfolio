import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreepyButton.css";

export default function CreepyButton({
  to,
  children,
  className = "",
  style = {},
  type = "button",
  disabled,
  onClick,
  href,
  target
}) {
  const navigate = useNavigate();
  const eyesRef = useRef(null);
  const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });
  const [hinge] = useState(() => Math.random() > 0.5 ? 'left' : 'right');

  const translateX = `${-50 + eyeCoords.x * 50}%`;
  const translateY = `${-50 + eyeCoords.y * 50}%`;
  const eyeStyle = {
    transform: `translate(${translateX}, ${translateY})`
  };

  const updateEyes = (e) => {
    const userEvent = e.touches ? e.touches[0] : e;
    const eyesRect = eyesRef.current?.getBoundingClientRect();
    if (!eyesRect) return;

    const eyesReady = {
      x: eyesRect.left + eyesRect.width / 2,
      y: eyesRect.top + eyesRect.height / 2
    };
    const cursor = {
      x: userEvent.clientX,
      y: userEvent.clientY
    };

    const dx = cursor.x - eyesReady.x;
    const dy = cursor.y - eyesReady.y;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;

    const visionRangeX = 180;
    const visionRangeY = 75;
    const distance = Math.hypot(dx, dy);
    
    // Limita la sporgenza massima delle pupille se escono molto dall'occhio
    const rawX = Math.sin(angle) * (distance / visionRangeX);
    const rawY = Math.cos(angle) * (distance / visionRangeY);

    setEyeCoords({ 
      x: Math.max(-1, Math.min(1, rawX)), 
      y: Math.max(-1, Math.min(1, rawY)) 
    });
  };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
    if (href && !e.defaultPrevented) {
      e.preventDefault();
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
      return;
    }
    if (to && !e.defaultPrevented) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <button
      className={`creepy-btn ${className}`}
      style={style}
      type={type}
      disabled={disabled}
      data-hinge={hinge}
      onClick={handleClick}
      onMouseMove={updateEyes}
      onTouchMove={updateEyes}
    >
      <span className="creepy-btn__eyes" ref={eyesRef}>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__pupil" style={eyeStyle}></span>
        </span>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__pupil" style={eyeStyle}></span>
        </span>
      </span>
      <span className="creepy-btn__cover">{children}</span>
    </button>
  );
}
