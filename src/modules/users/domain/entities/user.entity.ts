import { randomUUID } from 'crypto';
import { Role } from '../../../../shared/domain/enums/role.enum';

export interface UserProps {
  id: string;
  documentoIdentidad: string;
  name: string;
  email: string;
  telephone: string;
  role: Role;
  passwordHash: string;
}

export type UserDetails = Pick<
  UserProps,
  'documentoIdentidad' | 'name' | 'email' | 'telephone' | 'role'
>;

export class User {
  readonly id: string;
  documentoIdentidad: string;
  name: string;
  email: string;
  telephone: string;
  role: Role;
  passwordHash: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.documentoIdentidad = props.documentoIdentidad;
    this.name = props.name;
    this.email = props.email;
    this.telephone = props.telephone;
    this.role = props.role;
    this.passwordHash = props.passwordHash;
  }

  static create(props: Omit<UserProps, 'id'>): User {
    return new User({ ...props, id: randomUUID(), email: props.email.trim().toLowerCase() });
  }

  /** Actualiza los datos y devuelve los nombres de los campos que cambiaron (para auditoría). */
  updateDetails(details: UserDetails): string[] {
    const next = { ...details, email: details.email.trim().toLowerCase() };
    const changed = (Object.keys(next) as (keyof UserDetails)[]).filter(
      (key) => this[key] !== next[key],
    );
    Object.assign(this, next);
    return changed;
  }

  changePassword(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }
}
