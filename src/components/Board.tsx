import type { CSSProperties } from "react";
import type { Tile } from "../types";

type Props = {
  rows: Tile[][];
  currentRow: number;
  shake: boolean;
  revealingRow: number | null;
  won: boolean;
};

export function Board({ rows, currentRow, shake, revealingRow, won }: Props) {
  return (
    <div
      className={`board ${shake ? "board--shake" : ""} ${won ? "board--won" : ""}`}
      role="grid"
      aria-label="Word guesses"
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="board-row"
          role="row"
          aria-current={rowIndex === currentRow ? "true" : undefined}
        >
          {row.map((tile, colIndex) => (
            <TileCell
              key={colIndex}
              tile={tile}
              rowIndex={rowIndex}
              colIndex={colIndex}
              isActiveRow={rowIndex === currentRow}
              isRevealing={revealingRow === rowIndex}
              isFilled={!!tile.letter}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function TileCell({
  tile,
  rowIndex,
  colIndex,
  isActiveRow,
  isRevealing,
  isFilled,
}: {
  tile: Tile;
  rowIndex: number;
  colIndex: number;
  isActiveRow: boolean;
  isRevealing: boolean;
  isFilled: boolean;
}) {
  const evaluated =
    tile.status === "correct" ||
    tile.status === "present" ||
    tile.status === "absent" ||
    tile.status === "hint";

  const classes = [
    "tile",
    evaluated ? `tile--${tile.status}` : "",
    evaluated ? "tile--revealed" : "",
    isFilled && isActiveRow && !evaluated ? "tile--pop" : "",
    isRevealing && evaluated ? "tile--revealing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style = isRevealing
    ? ({ "--flip-delay": `${colIndex * 350}ms` } as CSSProperties)
    : undefined;

  return (
    <div
      className={classes}
      role="gridcell"
      style={style}
      data-row={rowIndex}
      data-col={colIndex}
      aria-label={tile.letter ? tile.letter : "empty"}
    >
      <div className="tile-inner">
        <div className="tile-front">{tile.letter}</div>
        <div className="tile-back">{tile.letter}</div>
      </div>
    </div>
  );
}
