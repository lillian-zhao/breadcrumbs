import type { Audience, UserId } from './types';

/**
 * Who is asking. Today an Actor is just a user id because there is no auth.
 * When Firebase Auth lands, an Actor is built from the signed-in user and the
 * rest of the API layer does not change - it only ever talks to an Actor and a
 * PermissionPolicy, never to auth state directly.
 */
export interface Actor {
  userId: UserId;
}

/** How the actor relates to the resource owner. */
export type Relationship = 'self' | 'friend' | 'blocked' | 'stranger';

export type Permission =
  | 'profile:read'
  | 'profile:write'
  | 'friends:read'
  | 'crumbs:read'
  | 'crumbs:write'
  | 'photos:write'
  | 'places:read'
  | 'places:write'
  | 'albums:read'
  | 'preferences:read'
  | 'preferences:write'
  | 'accounts:read'
  | 'accounts:write';

/** The target of a permission check. */
export interface Resource {
  ownerId: UserId;
  relationship: Relationship;
  /** For crumb/day reads: the visibility chosen by the owner. */
  audience?: Audience;
}

export interface PermissionPolicy {
  can(actor: Actor, permission: Permission, resource: Resource): boolean;
}

/** Thrown when an API call is not allowed by the active policy. */
export class PermissionDeniedError extends Error {
  readonly permission: Permission;
  readonly ownerId: UserId;
  readonly relationship: Relationship;

  constructor(permission: Permission, resource: Resource) {
    super(
      'Permission denied: ' +
        permission +
        ' on ' +
        resource.ownerId +
        ' (' +
        resource.relationship +
        ')',
    );
    this.name = 'PermissionDeniedError';
    this.permission = permission;
    this.ownerId = resource.ownerId;
    this.relationship = resource.relationship;
  }
}

/**
 * The default policy. Replace it with a richer one once auth / roles / privacy
 * settings exist; the API layer is agnostic to the concrete policy.
 *
 * Rules:
 *   - blocked: denied everything.
 *   - self:    allowed everything.
 *   - friend:  read profile, friends, saved places, albums; read crumbs only
 *              when the owner chose the "friends" audience.
 *   - stranger: read public profile only.
 *   - any write: self only.
 */
export const defaultPolicy: PermissionPolicy = {
  can(_actor, permission, resource) {
    if (resource.relationship === 'blocked') return false;
    if (resource.relationship === 'self') return true;

    const isWrite = permission.endsWith(':write');
    if (isWrite) return false;

    if (resource.relationship === 'friend') {
      switch (permission) {
        case 'profile:read':
        case 'friends:read':
        case 'places:read':
        case 'albums:read':
          return true;
        case 'crumbs:read':
          return resource.audience === 'friends';
        default:
          return false;
      }
    }

    // stranger
    return permission === 'profile:read';
  },
};
