import { API_BASE_URL, ApiRequestError } from '@/lib/api-client';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload?.message ??
        payload?.error?.message ??
        `Login failed with status ${response.status}`;
      throw new ApiRequestError(
        Array.isArray(message) ? message.join(' · ') : message,
        response.status,
        payload?.error?.key,
        payload,
      );
    }

    return payload as LoginResponse;
  },
};