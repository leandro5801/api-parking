import { Role } from '../enum/enum.role.js';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public telephone: string,
    public readonly role: Role,
  ) {}

  updateDetails(name: string, email: string, telephone: string): void {
    this.name = name;
    this.email = email;
    this.telephone = telephone;
  }
}
