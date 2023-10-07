import { Module } from "@nestjs/common";
import { IssuesService } from "./issues.service";
import { IssuesController } from "./issues.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Issue } from "./entities/issue.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Issue])],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
