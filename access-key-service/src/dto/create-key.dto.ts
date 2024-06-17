export class CreateKeyDto {
    readonly userId: string;
    readonly rateLimit: number;
    readonly expiration: Date;
  }
  