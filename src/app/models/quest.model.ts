export interface Quest {
  readonly id: string;
  readonly resource: 'sp';
  readonly label: string;
  readonly tooltip: string;
  readonly pointsPer: number;
  readonly max: number;
}
