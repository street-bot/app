import {IConfig} from '../types/config.d'

export class Config implements IConfig {
  signalingHost: string
  versionHash: string
  
  constructor() {
    this.signalingHost = process.env.NODE_ENV === 'production' ? 'wss://signaler.internal.street-bot.com': 'ws://localhost:8080';
    this.versionHash = process.env.REACT_APP_SHA1 || 'development';
  }
}