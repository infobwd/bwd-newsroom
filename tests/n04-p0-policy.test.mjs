import assert from 'node:assert/strict';
import {
  NEWSROOM_ORIGIN,checkP0Preflight,createP0UploadGate,inspectP0Image
} from '../scripts/n04-p0-policy.mjs';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const now=1800000000,audience='synthetic-google-client-id.apps.googleusercontent.com';
const base={
  iss:'https://accounts.google.com',aud:audience,exp:now+3600,
  sub:'synthetic-workspace-sub',email:'teacher@school.example',email_verified:true,hd:'school.example'
};
const tokens=new Map([
  ['school',{...base}],
  ['gmail',{...base,sub:'synthetic-gmail-sub',email:'teacher.testing@gmail.com',hd:undefined}],
  ['expired',{...base,exp:now-1}],
  ['wrong-aud',{...base,aud:'other-client-id'}],
  ['wrong-issuer',{...base,iss:'https://example.org'}],
  ['unverified-email',{...base,email_verified:false}],
  ['unknown',{...base,sub:'unlisted-sub',email:'unknown@gmail.com',hd:undefined}],
  ['wrong-workspace',{...base,sub:'synthetic-gmail-sub',email:'teacher@unapproved.school',hd:'unapproved.school'}]
]);
const allowlist=new Map([
  ['synthetic-workspace-sub',{subject:'synthetic-workspace-sub',active:true,email:'teacher@school.example',role:'teacher',allowedEventIds:['EVT-2569-9001']}],
  ['synthetic-gmail-sub',{subject:'synthetic-gmail-sub',active:true,email:'teacher.testing@gmail.com',role:'teacher',allowedEventIds:['EVT-2569-9001']}]
]);
const gate=createP0UploadGate({
  audience,hostedDomains:['school.example'],nowSeconds:()=>now,
  verifyGoogleIdToken:async(token)=>{
    if(!tokens.has(token))throw Error('signature or audience invalid');
    return tokens.get(token); // Synthetic ONLY; production must use Google's real cryptographic verifier.
  },
  lookupApprovedUploader:async sub=>allowlist.get(sub)
});
const request=(idToken='school',eventId='EVT-2569-9001',origin=NEWSROOM_ORIGIN)=>
  gate({idToken,eventId,origin});

assert.equal((await request()).ok,true,'authorized school Workspace account');
assert.equal((await request('school')).accountType,'school');
assert.equal((await request('gmail')).ok,true,'authorized personal Gmail account');
assert.equal((await request('gmail')).accountType,'gmail');
assert.equal((await request('unknown')).ok,false,'unknown Gmail must not self-register');
for(const token of ['expired','wrong-aud','wrong-issuer','unverified-email','wrong-workspace','forged']){
  assert.equal((await request(token)).ok,false,'invalid Google identity rejected: '+token);
}
assert.equal((await request('school','EVT-2569-9999')).code,'EVENT_PERMISSION_DENIED');
assert.equal((await request('school','../private')).code,'EVENT_DENIED');
assert.equal((await request('school','EVT-2569-9001','https://evil.example')).code,'ORIGIN_DENIED');
assert.equal((await request('')).code,'AUTH_REQUIRED');
const workspace=allowlist.get('synthetic-workspace-sub');
workspace.active=false;
assert.equal((await request('school')).code,'UPLOADER_DENIED','revoked school uploader denied');
workspace.active=true;workspace.role='reviewer';
assert.equal((await request('school')).code,'ROLE_DENIED','reviewer cannot upload');
workspace.role='teacher';workspace.email='changed@school.example';
assert.equal((await request('school')).code,'UPLOADER_DENIED','changed identity requires reapproval');
workspace.email='teacher@school.example';
assert.equal((await request('school')).ok,true);

assert.equal(checkP0Preflight({origin:NEWSROOM_ORIGIN,method:'POST',requestHeaders:['Authorization','Content-Type','X-CSRF-Token','X-Idempotency-Key']}).ok,true);
assert.equal(checkP0Preflight({origin:'null',method:'POST'}).ok,false);
assert.equal(checkP0Preflight({origin:'https://infobwd.github.io.evil.example',method:'POST'}).ok,false);
assert.equal(checkP0Preflight({origin:NEWSROOM_ORIGIN,method:'GET'}).ok,false);
assert.equal(checkP0Preflight({origin:NEWSROOM_ORIGIN,method:'POST',requestHeaders:['X-Drive-Token']}).ok,false);

const jpeg=Uint8Array.from([0xff,0xd8,0xff,0xe0,0]);
const png=Uint8Array.from([137,80,78,71,13,10,26,10,0]);
const webp=Uint8Array.from([82,73,70,70,1,0,0,0,87,69,66,80,0]);
for(const [filename,mimeType,bytes] of [
  ['ภาพกิจกรรม.jpg','image/jpeg',jpeg],
  ['photo.png','image/png',png],
  ['photo.webp','image/webp',webp]
]){
  assert.equal(inspectP0Image({filename,mimeType,bytes,sizeBytes:bytes.length}).ok,true,filename);
}
assert.equal(inspectP0Image({filename:'photo.heic',mimeType:'image/heic',bytes:jpeg,sizeBytes:jpeg.length}).ok,false,'HEIC requires approved conversion');
assert.equal(inspectP0Image({filename:'photo.jpg',mimeType:'image/jpeg',bytes:png,sizeBytes:png.length}).ok,false,'reject a spoofed MIME header');
assert.equal(inspectP0Image({filename:'../photo.jpg',mimeType:'image/jpeg',bytes:jpeg,sizeBytes:jpeg.length}).ok,false,'no path traversal');
assert.equal(inspectP0Image({filename:'a.jpg',mimeType:'image/jpeg',bytes:jpeg,sizeBytes:999}).ok,false,'actual byte count must match');
const oversized=new Uint8Array(12*1024*1024+1);
oversized.set(jpeg);
assert.equal(inspectP0Image({filename:'a.jpg',mimeType:'image/jpeg',bytes:oversized,sizeBytes:oversized.length}).code,'FILE_TOO_LARGE');
const sw=read('sw.js');
assert.doesNotMatch(sw,/teacher-upload|n04-p0-policy/,'private uploader is never precached in read-only PWA');
const publicCatalog=read('data/galleries.json');
assert.doesNotMatch(publicCatalog,/EVT-2569-9001|teacher\.testing@gmail\.com/,'synthetic and private records stay out of public Gallery');
const workflow=read('.github/workflows/static-qa.yml');
assert.match(workflow,/node tests\/n04-p0-policy\.test\.mjs/,'CI must exercise the P0 deny-first contract');
console.log('PASS N04-P0 synthetic only: verified-identity adapter contract, Workspace/Gmail allowlist, revocation, event roles, CORS and image preflight');
console.log('NOT RUN: real Google OIDC, cross-origin credentialed browser upload, server CORS, Shared Drive write, device testing');
