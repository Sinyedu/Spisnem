export type InsightsRange = {
  from: Date;
  to: Date;
};

export type HourBucket = {
  // Hour of day in the restaurant's time zone, 0–23.
  hour: number;
  parties: number;
  averageWaitMinutes: number | null;
};

export type QuoteAccuracy = {
  // Visits where both a quote and a real wait exist.
  samples: number;
  meanAbsoluteErrorMinutes: number | null;
  // Share (0–1) of guests called within 5 minutes of what they were promised.
  withinFiveMinutesShare: number | null;
};

export type Insights = {
  from: string;
  to: string;
  parties: number;
  guestsSeated: number;
  seated: number;
  leftQueue: number;
  noShows: number;
  averageWaitMinutes: number | null;
  byHour: HourBucket[];
  accuracy: QuoteAccuracy;
};
