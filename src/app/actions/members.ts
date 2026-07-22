// src > app > actions > members.ts
'use server';

import { InviteMemberSchema } from '@/schemas/inviteMember.schema';
import { getAuthCookies } from '@/lib/auth';
import { endPoints } from '@/lib/endpoints';
import { baseURL, supabaseKey } from '@/lib/supabase';
import { z } from 'zod';

// ==============================================================
// ● ● ● Invite Member Action ● ● ●
// ==============================================================
export async function inviteMemberRequest(
  payload: Omit<z.input<typeof InviteMemberSchema>, 'p_base_url'>,
) {
  try {
    const targetBaseUrl = baseURL;

    if (!targetBaseUrl) {
      return { error: 'Server configuration error: Missing Supabase URL.' };
    }

    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return { error: 'Unauthorized. Please log in again.' };
    }

    // Attach baseURL directly inside the action
    const fullPayload = {
      ...payload,
      p_base_url: targetBaseUrl,
    };

    // Validate input using Zod Schema
    const parsed = InviteMemberSchema.safeParse(fullPayload);

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid form input.',
      };
    }

    // JSON.stringify(value, replacer, space) → makes complex backend payloads much easier to read
    // 'null' or 'replacer' → "don't filter anything out—stringify all keys and values as they are."
    // '2' or 'space' → (The Indentation / Space) → specifies the number of spaces to use for indentation in the output string.
    console.log(
      'Final Payload Sent to Supabase:',
      JSON.stringify(parsed.data, null, 2),
    );
    // from terminal
    //     Final Payload Sent to Supabase: {
    //   "p_email": "tam55hady@gmail.com",
    //   "p_project_id": "bd3c69cc-cad9-442e-8169-e2a689fb1a9c",
    //   "p_app_url": "http://localhost:3000",
    //   "p_base_url": "https://bessapiuchcxktgehdry.supabase.co"
    // }
    const response = await fetch(
      `${targetBaseUrl}${endPoints.members.inviteMember}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(parsed.data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData.message || errorData.msg || 'Failed to send invitation.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Invite Action Error:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Failed to send invitation.',
    };
  }
}

// ==============================================================
// ● ● ● Accept Invitation Action ● ● ●
// ==============================================================
import { AcceptInviteSchema } from '@/schemas/acceptInvitation.schema';

export async function acceptInvitationRequest(
  payload: z.infer<typeof AcceptInviteSchema>,
) {
  try {
    const targetBaseUrl = baseURL;

    if (!targetBaseUrl) {
      return { error: 'Server configuration error: Missing Supabase URL.' };
    }

    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return {
        error: 'Unauthorized. Please log in to accept this invitation.',
        status: 401,
      };
    }

    // Validate Token Payload → p_token get it from url query params
    const parsed = AcceptInviteSchema.safeParse(payload);

    // if Invalid Token
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || 'Invalid invitation token.',
      };
    }

    const response = await fetch(
      `${targetBaseUrl}${endPoints.members.acceptInvitation}`,
      {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle explicit auth/permission status codes
      if (response.status === 401) {
        return {
          error: 'Unauthorized user. Please log in again.',
          status: 401,
        };
      }
      if (response.status === 403) {
        return {
          error:
            'Forbidden. You do not have permission to accept this invitation.',
          status: 403,
        };
      }

      // Handle (invalid/expired tokens)
      const message = errorData.message || errorData.msg || '';

      if (message.toLowerCase().includes('expired')) {
        return { error: 'This invitation link has expired.' };
      }
      if (message.toLowerCase().includes('invalid')) {
        return { error: 'Invalid or already used invitation token.' };
      }

      return {
        error: message || 'Failed to accept invitation.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Accept Invitation Action Error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Network/API error. Please try again.',
    };
  }
}
