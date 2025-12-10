declare module 'resend' {
  export interface ResendEmailSendRequest {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    reply_to?: string | string[];
  }

  export interface ResendEmailSendResponse {
    data?: { id: string };
    error?: unknown;
  }

  export interface ResendDomainsListResponse {
    data?: Array<Record<string, unknown>>;
  }

  export class Resend {
    constructor(apiKey?: string);
    emails: {
      send(params: ResendEmailSendRequest): Promise<ResendEmailSendResponse>;
    };
    domains: {
      list(): Promise<ResendDomainsListResponse>;
    };
  }
}

