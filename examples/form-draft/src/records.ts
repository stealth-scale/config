/**
 * Stands in for the database the profile is saved in, so the form has a record to start from and
 * a place to write to.
 */

/**
 * Describes a saved profile.
 */
export interface Profile {
  /**
   * A few lines about the person.
   */
  readonly bio: string;

  /**
   * The address the person is reached at.
   */
  readonly email: string;

  /**
   * The identifier the profile is saved under.
   */
  readonly id: string;

  /**
   * The person's name.
   */
  readonly name: string;
}

/**
 * The profiles the database starts with.
 */
const INITIAL: readonly Profile[] = [{ bio: "", email: "roy@example.com", id: "p-1", name: "Roy" }];

/**
 * The profiles saved so far, by identifier.
 */
const saved = new Map<string, Profile>();

/**
 * Puts the database back as it started, which a specification does before each case.
 */
export function resetProfiles(): void {
  saved.clear();

  for (const profile of INITIAL) saved.set(profile.id, profile);
}

/**
 * Reads a saved profile.
 *
 * @returns The profile, or nothing where none is saved under the identifier.
 */
export function readProfile(id: string): Profile | undefined {
  return saved.get(id);
}

/**
 * Saves a profile under its identifier.
 */
export function writeProfile(profile: Profile): void {
  saved.set(profile.id, profile);
}

resetProfiles();
