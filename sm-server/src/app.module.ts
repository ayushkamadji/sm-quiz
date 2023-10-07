import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IssuesModule } from "./issues/issues.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ["./dist/issues/entities"],
      entitiesTs: ["./src/issues/entities"],
      dbName: "my-db-name.sqlite3",
      type: "sqlite",
    }),
    IssuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
