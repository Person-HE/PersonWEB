import type { Env, APIContext } from '../_helper';
export async function onRequestGet(context: APIContext): Promise<Response> {
  return new Response(JSON.stringify({ ok: true, time: new Date().toISOString(), platform: 'cloudflare' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}