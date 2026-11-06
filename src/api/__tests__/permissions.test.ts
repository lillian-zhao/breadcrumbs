import { describe, expect, it } from '@jest/globals';
import { defaultPolicy } from '@/api/permissions';
import type { Actor } from '@/api/permissions';

const alicia: Actor = { userId: 'alicia' };

describe('defaultPolicy', () => {
  it('allows self for everything', () => {
    expect(defaultPolicy.can(alicia, 'preferences:write', { ownerId: 'alicia', relationship: 'self' })).toBe(true);
    expect(defaultPolicy.can(alicia, 'crumbs:read', { ownerId: 'alicia', relationship: 'self', audience: 'private' })).toBe(true);
  });

  it('denies blocked for everything', () => {
    expect(defaultPolicy.can(alicia, 'profile:read', { ownerId: 'x', relationship: 'blocked' })).toBe(false);
    expect(defaultPolicy.can(alicia, 'crumbs:read', { ownerId: 'x', relationship: 'blocked', audience: 'friends' })).toBe(false);
  });

  it('lets a friend read profile, friends, places, and albums', () => {
    expect(defaultPolicy.can(alicia, 'profile:read', { ownerId: 'x', relationship: 'friend' })).toBe(true);
    expect(defaultPolicy.can(alicia, 'friends:read', { ownerId: 'x', relationship: 'friend' })).toBe(true);
    expect(defaultPolicy.can(alicia, 'places:read', { ownerId: 'x', relationship: 'friend' })).toBe(true);
    expect(defaultPolicy.can(alicia, 'albums:read', { ownerId: 'x', relationship: 'friend' })).toBe(true);
  });

  it('gates a friend crumb read on the friends audience', () => {
    expect(defaultPolicy.can(alicia, 'crumbs:read', { ownerId: 'x', relationship: 'friend', audience: 'friends' })).toBe(true);
    expect(defaultPolicy.can(alicia, 'crumbs:read', { ownerId: 'x', relationship: 'friend', audience: 'private' })).toBe(false);
  });

  it('only allows writes on self', () => {
    expect(defaultPolicy.can(alicia, 'profile:write', { ownerId: 'x', relationship: 'friend' })).toBe(false);
    expect(defaultPolicy.can(alicia, 'places:write', { ownerId: 'alicia', relationship: 'self' })).toBe(true);
  });

  it('lets a stranger read only the public profile', () => {
    expect(defaultPolicy.can(alicia, 'profile:read', { ownerId: 'x', relationship: 'stranger' })).toBe(true);
    expect(defaultPolicy.can(alicia, 'friends:read', { ownerId: 'x', relationship: 'stranger' })).toBe(false);
    expect(defaultPolicy.can(alicia, 'crumbs:read', { ownerId: 'x', relationship: 'stranger' })).toBe(false);
    expect(defaultPolicy.can(alicia, 'places:read', { ownerId: 'x', relationship: 'stranger' })).toBe(false);
  });
});
