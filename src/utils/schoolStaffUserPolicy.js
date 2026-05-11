const DIRECTOR_CREATABLE_LIST = ['head_teacher', 'bursar', 'class_teacher', 'subject_teacher'];

/**
 * Roles a logged-in user may assign when creating a new user.
 * @param {string} actorRole
 * @returns {string[] | null} null = admin (UI shows full set)
 */
export function creatableUserRoles(actorRole) {
  switch (actorRole) {
    case 'admin':
      return null;
    case 'director':
      return [...DIRECTOR_CREATABLE_LIST];
    case 'head_teacher':
      return ['class_teacher', 'subject_teacher'];
    default:
      return [];
  }
}

/**
 * Role options shown when editing a user (null = admin: full list in UI).
 */
export function assignableUserRoles(actor, targetUser) {
  if (!actor?.role || !targetUser) return [];
  if (actor.role === 'admin') return null;
  if (actor.role === 'director') {
    if (targetUser.role === 'director' && Number(actor.id) === Number(targetUser.id)) {
      return ['director'];
    }
    return [...DIRECTOR_CREATABLE_LIST];
  }
  if (actor.role === 'head_teacher') {
    return ['class_teacher', 'subject_teacher'];
  }
  return [];
}

export function canManageUserRow(actor, targetUser) {
  if (!actor?.role || !targetUser) return false;
  if (actor.role === 'admin') return true;
  if (actor.school_id == null || targetUser.school_id == null) return false;
  if (Number(actor.school_id) !== Number(targetUser.school_id)) return false;
  if (actor.role === 'director') {
    if (targetUser.role === 'admin') return false;
    if (targetUser.role === 'director') return Number(actor.id) === Number(targetUser.id);
    return true;
  }
  if (actor.role === 'head_teacher') {
    return targetUser.role === 'class_teacher' || targetUser.role === 'subject_teacher';
  }
  return false;
}
