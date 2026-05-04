export interface TrackingData {
  id: number;
  bowler: string;
  runs: number;
  isWicket: boolean;
  isBoundary: boolean;
  pitchX: number; // width across crease (-1.5 to 1.5)
  pitchY: number; // distance from batter (0 to 20)
  stumpX: number; // width across stumps (-1 to 1)
  stumpY: number; // height from ground (0 to 2)
  wagonAngle: number; // 0 to 360 degrees
  wagonDistance: number; // 0 to 90 meters
  bowlingType: 'Pace' | 'Spin';
}

export interface FilterState {
  runs: number[]; // array of selected run values (e.g. [0, 4, 6])
  showWickets: boolean;
  bowlingType: string | null;
}
