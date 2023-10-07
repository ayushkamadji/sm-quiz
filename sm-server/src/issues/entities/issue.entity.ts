import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Issue {
  @PrimaryKey()
  id: number;

  @Property({ length: 255 })
  title: string;

  @Property({ length: 255 })
  description: string;
}
