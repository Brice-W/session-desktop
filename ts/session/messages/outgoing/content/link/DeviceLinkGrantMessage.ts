import { SignalService } from '../../../../../protobuf';
import { DeviceLinkRequestMessage } from './DeviceLinkRequestMessage';
import { LokiProfile } from '../../../../../types/Message';

interface DeviceLinkGrantMessageParams {
  timestamp: number;
  identifier: string;

  // pairing authorisation
  primaryDevicePubKey: string;
  secondaryDevicePubKey: string;
  requestSignature: Uint8Array;
  grantSignature: Uint8Array;

  lokiProfile: LokiProfile;
}

export class DeviceLinkGrantMessage extends DeviceLinkRequestMessage {
  private readonly displayName: string;
  private readonly avatarPointer: string;
  private readonly profileKey: Uint8Array;
  private readonly grantSignature: Uint8Array | null;

  constructor(params: DeviceLinkGrantMessageParams
  ) {
    super({
      timestamp: params.timestamp,
      identifier: params.identifier,
      primaryDevicePubKey: params.primaryDevicePubKey,
      secondaryDevicePubKey: params.secondaryDevicePubKey,
      requestSignature: params.requestSignature,
    });

    this.displayName = params.lokiProfile.displayName;
    this.avatarPointer = params.lokiProfile.avatarPointer;
    this.profileKey = params.lokiProfile.profileKey;
    this.grantSignature = params.grantSignature;
  }

  protected getPairingAuthorisationMessage(): SignalService.PairingAuthorisationMessage {
    return new SignalService.PairingAuthorisationMessage({
      primaryDevicePubKey: this.primaryDevicePubKey,
      secondaryDevicePubKey: this.secondaryDevicePubKey,
      requestSignature: this.requestSignature,
      grantSignature: this.grantSignature,
    });
  }

  protected getDataMessage(): SignalService.DataMessage | null {
    // Send profile name to secondary device and avatarPointer
    const profile = new SignalService.DataMessage.LokiProfile();
    profile.avatar = this.avatarPointer;
    profile.displayName = this.displayName;

    return new SignalService.DataMessage({
      profile,
      profileKey: this.profileKey,
    });
  }
}
