import React from "react";

function Logo(props) {
  const size = props.size || 32;

  return (
    <div className="flex items-center gap-2.5 select-none">
      <img
        src="/logo-mark.png"
        alt="clouzX"
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
        draggable={false}
      />
      {props.showText === false ? null : (
        <span className="font-display font-bold tracking-tight text-white" style={{ fontSize: size * 0.62 }}>
          clouz<span className="text-gradient-brand">X</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
