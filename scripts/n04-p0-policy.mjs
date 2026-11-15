/**
 * N04-P0 OFFLINE feasibility policy only; NOT a deployed authentication or upload API.
 *
 * This module MUST NOT be called on unsigned client-supplied JSON. Its injected
 * verifyGoogleIdToken() adapter must cryptographically verify the Google signature,
 * issuer, expected audience, and expiry (e.g. google-auth-library verifyIdToken).
 * lookupApprovedUploader() must read a PRIVATE school-managed allowlist on the server.
 *
 * Cross-origin policy alone is not authentication. No keys/teacher identities,
 * Drive IDs, storage adapter, endpoint, or publish logic belong in public Pages JS.
 */
export const NEWSROOM_ORIGIN='https://infobwd.github.io';
const GOOGLE_ISSUERS=new Set(['accounts.google.com','https://accounts.google.com']);
const EVENT_ID=/^EVT-[0-9]{4}-[0-9]{4}$/;
const ALLOWED_ROLE=new Set(['teacher','administrator']);

function reject(code){return {ok:false,code};}
function normalizeEmail(input){
  return typeof input==='string'?input.trim().toLowerCase():'';
}

/**
 * Pure validation of the intended CORS gate. This is not a CORS implementation:
 * the selected backend must return real CORS response headers and reject
 * unauthorized requests independently of the browser's Origin header.
 */
export function checkP0Preflight({origin,method,requestHeaders=[]}={}){
  if(origin!==NEWSROOM_ORIGIN)return reject('ORIGIN_DENIED');
  if(method!=='POST')return reject('METHOD_DENIED');
  if(!Array.isArray(requestHeaders))return reject('HEADER_DENIED');
  const allowed=new Set(['authorization','content-type','x-csrf-token','x-idempotency-key']);
  if(requestHeaders.some(h=>typeof h!=='string'||!allowed.has(h.toLowerCase())))return reject('HEADER_DENIED');
  return {ok:true,origin:NEWSROOM_ORIGIN,methods:['POST'],headers:[...allowed]};
}

/**
 * Asks a trusted (injected) cryptographic verifier for Google OIDC claims.
 * Never grant rights from email suffix/domain alone; a verified Google sub and
 * a PRIVATE active allowlist entry with event permission are both mandatory.
 */
export function createP0UploadGate({verifyGoogleIdToken,lookupApprovedUploader,audience,hostedDomains=[],nowSeconds=()=>Math.floor(Date.now()/1000)}={}){
  if(typeof verifyGoogleIdToken!=='function'||typeof lookupApprovedUploader!=='function')
    throw new TypeError('Trusted verifier and private allowlist provider are required');
  if(typeof audience!=='string'||!audience)throw new TypeError('Google OAuth client audience required');
  const schoolDomains=new Set(hostedDomains.map(d=>String(d).toLowerCase()));
  return async function authorizeRequest({origin,idToken,eventId}={}){
    if(origin!==NEWSROOM_ORIGIN)return reject('ORIGIN_DENIED');
    if(typeof eventId!=='string'||!EVENT_ID.test(eventId))return reject('EVENT_DENIED');
    if(typeof idToken!=='string'||!idToken)return reject('AUTH_REQUIRED');
    let claims;
    try{
      claims=await verifyGoogleIdToken(idToken,{audience});
    }catch{
      return reject('TOKEN_INVALID');
    }
    if(!claims||!GOOGLE_ISSUERS.has(claims.iss)||claims.aud!==audience||
       !Number.isFinite(claims.exp)||claims.exp<=nowSeconds()||
       typeof claims.sub!=='string'||!claims.sub||
       claims.email_verified!==true)return reject('CLAIMS_DENIED');
    const email=normalizeEmail(claims.email);
    if(!email)return reject('CLAIMS_DENIED');
    const schoolHosted=typeof claims.hd==='string'&&schoolDomains.has(claims.hd.toLowerCase());
    const accountType=email.endsWith('@gmail.com')?'gmail':schoolHosted?'school':null;
    if(!accountType)return reject('ACCOUNT_NOT_ELIGIBLE');
    let entry;
    try{entry=await lookupApprovedUploader(claims.sub);}catch{return reject('ALLOWLIST_UNAVAILABLE');}
    if(!entry||entry.active!==true||entry.subject!==claims.sub||
       normalizeEmail(entry.email)!==email)return reject('UPLOADER_DENIED');
    if(!ALLOWED_ROLE.has(entry.role))return reject('ROLE_DENIED');
    if(!Array.isArray(entry.allowedEventIds)||!entry.allowedEventIds.includes(eventId))
      return reject('EVENT_PERMISSION_DENIED');
    return {ok:true,subject:claims.sub,accountType,role:entry.role,eventId};
  };
}

const FILE_RULES=Object.freeze({
  'image/jpeg':{extensions:['.jpg','.jpeg'],check:b=>b.length>=3&&b[0]===0xff&&b[1]===0xd8&&b[2]===0xff},
  'image/png':{extensions:['.png'],check:b=>b.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v)},
  'image/webp':{extensions:['.webp'],check:b=>b.length>=12&&
    String.fromCharCode(...b.subarray(0,4))==='RIFF'&&
    String.fromCharCode(...b.subarray(8,12))==='WEBP'}
});
/**
 * Lightweight P0 preflight only: full image decode, antivirus/safety checks,
 * size/account quotas, retries, hashes and persistence belong to the backend.
 */
export function inspectP0Image({filename,mimeType,bytes,sizeBytes}={}){
  if(typeof filename!=='string'||filename.length>180||!/^[-\p{L}\p{M}\p{N}_. ()]+$/u.test(filename)||
     filename==='.'||filename==='..'||filename.startsWith('.'))return reject('FILE_NAME_INVALID');
  const rule=Object.hasOwn(FILE_RULES,mimeType)?FILE_RULES[mimeType]:null;
  if(!rule)return reject('TYPE_DENIED');
  if(!rule.extensions.some(ext=>filename.toLowerCase().endsWith(ext)))return reject('EXTENSION_MISMATCH');
  if(!(bytes instanceof Uint8Array)||bytes.length===0||!Number.isSafeInteger(sizeBytes)||
    sizeBytes!==bytes.byteLength)return reject('SIZE_MISMATCH');
  if(sizeBytes>12*1024*1024)return reject('FILE_TOO_LARGE'); // proposed P0 pilot budget; not production approval.
  if(!rule.check(bytes))return reject('SIGNATURE_MISMATCH');
  return {ok:true,mimeType,sizeBytes};
}
