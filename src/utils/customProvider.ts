// To be implemented

import { Database } from "bun:sqlite";

export class CustomProvider {
  private db: Database;

  constructor() {
    this.db = new Database("animedb.sqlite", {
      create: true,
    });
    this.init();
  }

  private init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS Anime (
        id INTEGER PRIMARY KEY,
        idMal INTEGER,
        idGogo TEXT,
        idGogoDub TEXT,
        idZoro TEXT,
        id9anime TEXT,
        idPahe TEXT
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS Stream (
        id TEXT PRIMARY KEY,
        idMal INTEGER,
        Main TEXT,
        Backup TEXT,
        Tracks TEXT,
        Iframe TEXT
      )
    `);
  }

  addAnime(anime: {
    id?: number;
    idMal?: number;
    idGogo?: string;
    idGogoDub?: string;
    idZoro?: string;
    id9anime?: string;
    idPahe?: string;
  }) {
    const { id, idMal, idGogo, idGogoDub, idZoro, id9anime, idPahe } = anime;
    return this.db.run(
      "INSERT INTO Anime (id, idMal, idGogo, idGogoDub, idZoro, id9anime, idPahe) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, idMal, idGogo, idGogoDub, idZoro, id9anime, idPahe]
    );
  }

  getAnimeById(id: number) {
    return this.db.query("SELECT * FROM Anime WHERE id = ?").get(id);
  }

  getAnimeByMalId(idMal: number) {
    return this.db.query("SELECT * FROM Anime WHERE idMal = ?").get(idMal);
  }

  updateAnime(
    id: number,
    anime: {
      idMal?: number;
      idGogo?: string;
      idGogoDub?: string;
      idZoro?: string;
      id9anime?: string;
      idPahe?: string;
    }
  ) {
    const { idMal, idGogo, idGogoDub, idZoro, id9anime, idPahe } = anime;
    return this.db.run(
      "UPDATE Anime SET idMal = ?, idGogo = ?, idGogoDub = ?, idZoro = ?, id9anime = ?, idPahe = ? WHERE id = ?",
      [idMal, idGogo, idGogoDub, idZoro, id9anime, idPahe, id]
    );
  }
}
