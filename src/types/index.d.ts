interface IDProvider {
  id: number;
  idGogo: string;
  idGogoDub: string;
  idZoro: string;
  id9anime: string;
  idPahe: string;
}

export interface AniSkipData {
  op: {
    startTime: number;
    endTime: number;
  },
  ed: {
    startTime: number;
    endTime: number;
  },
}