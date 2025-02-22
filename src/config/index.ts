import { IConfig } from '../types/config';

export class Config implements IConfig {
  signalingHost: string;
  signalingURL: string;
  versionHash: string;
  logLevel: string;
  hbInterval: number;

  constructor() {
    this.signalingHost = process.env.NODE_ENV === 'production' ? 'wss://signaler.internal.street-bot.com': 'ws://localhost:8080';
    this.signalingURL = process.env.NODE_ENV === 'production' ? 'https://signaler.internal.street-bot.com': 'http://localhost:8080';
    this.versionHash = process.env.REACT_APP_SHA1 || 'development';
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
    this.hbInterval =  process.env.HB_INTERVAL ? parseInt(process.env.HB_INTERVAL) : 500;
  }
}