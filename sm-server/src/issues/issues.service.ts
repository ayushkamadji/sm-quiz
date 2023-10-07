import { Injectable } from "@nestjs/common";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Issue } from "./entities/issue.entity";
import { EntityRepository } from "@mikro-orm/core";

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: EntityRepository<Issue>,
  ) {}

  async create(createIssueDto: CreateIssueDto) {
    const issue = await this.issueRepository.create(createIssueDto);
    return this.issueRepository.persistAndFlush(issue);
  }

  async findAll() {
    return await this.issueRepository.findAll();
  }

  async findOne(id: number) {
    return await this.issueRepository.findOne(id);
  }

  async update(id: number, updateIssueDto: UpdateIssueDto) {
    const issue = await this.issueRepository.findOne(id);
    await this.issueRepository.upsert({
      ...issue,
      ...updateIssueDto,
    });

    return { id, ...updateIssueDto };
  }

  async remove(id: number) {
    await this.issueRepository.removeAndFlush(
      await this.issueRepository.findOne(id),
    );
  }
}
