import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, StreamType, VoiceConnection } from "@discordjs/voice";
import { EventEmitter } from 'events';

import { BotLogger} from '@helpers/bot-logger';

export class SoundPlayer extends EventEmitter {

  private _voiceConneciton: VoiceConnection;
  private _audioPlayer: AudioPlayer;

  private _destroyAfterIdle: NodeJS.Timeout | undefined;

  public constructor(connection : VoiceConnection){
    super();
    this._voiceConneciton = connection;
    this._audioPlayer = createAudioPlayer();

    this._audioPlayer.on(AudioPlayerStatus.Idle, () => {
      BotLogger.log.info(`Gone iddle on channel ${this._voiceConneciton.joinConfig.channelId}`);
      this._destroyAfterIdle = setTimeout(() => {
        this.emit('destroyed');
      }, 600000);
    })

    this._audioPlayer.on('stateChange', ( oldStatus ) => {
      if(oldStatus.status === AudioPlayerStatus.Idle) {
        clearTimeout(this._destroyAfterIdle as NodeJS.Timeout);
      }
    });

    this._voiceConneciton.subscribe(this._audioPlayer);

  };

  public async play(soundFilename: string) {
    let audio = createAudioResource(soundFilename, {
      inputType: StreamType.Opus
    })

    BotLogger.log.info(`Playing ${soundFilename}`)
    this._audioPlayer.play(audio);
  }

}