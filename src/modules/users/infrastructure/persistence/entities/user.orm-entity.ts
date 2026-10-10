import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'usuario' })
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'documento_identidad', unique: true })
  documentoIdentidad: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telephone: string;

  @Column()
  role: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;
}
