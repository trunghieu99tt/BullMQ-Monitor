import {
  Body,
  BodyParam,
  Controller,
  Get,
  JsonController,
  Param,
  Post,
  QueryParams,
} from "routing-controllers";
import Container, { Service } from "typedi";
import { GetJobListQuery } from "./dtos/get-job-list-query-params.dto";
import { QueueMonitorService } from "./queue-monito.service";

@Controller("queue-monitor")
@JsonController("/queue-monitor")
@Service()
export class QueueMonitorController {
  constructor(private readonly queueMonitorService: QueueMonitorService) {
    this.queueMonitorService = Container.get(QueueMonitorService);
  }

  @Get()
  async getAllQueuesInfo() {
    console.debug("getAllQueuesInfo");
    return this.queueMonitorService.getQueues();
  }

  @Get("/redis")
  async getRedisInfo() {
    return this.queueMonitorService.getRedisInfo();
  }

  @Post("/job-list")
  async getJobList(@Body() getJobListBody: GetJobListQuery) {
    return this.queueMonitorService.getJobsByTypes(
      getJobListBody.queueName,
      getJobListBody.jobTypes,
      getJobListBody.page,
      getJobListBody.pageSize
    );
  }

  @Get("/:queueName")
  async getJobCounts(@Param("queueName") queueName: string) {
    console.debug(`getJobCounts: ${queueName}`);
    return this.queueMonitorService.getJobCounts(queueName);
  }

  @Post("/:queueName/pause")
  async pauseQueue(@Param("queueName") queueName: string) {
    console.debug(`pauseQueue: ${queueName}`);
    return this.queueMonitorService.pauseQueue(queueName);
  }

  @Post("/:queueName/resume")
  async resumeQueue(@Param("queueName") queueName: string) {
    console.debug(`resumeQueue: ${queueName}`);
    return this.queueMonitorService.resumeQueue(queueName);
  }

  @Post("/:queueName/:jobId/retry")
  async retryJob(
    @Param("queueName") queueName: string,
    @Param("jobId") jobId: string
  ) {
    return this.queueMonitorService.retryJob(queueName, jobId);
  }

  @Post("/:queueName/:jobId/remove")
  async removeJob(
    @Param("queueName") queueName: string,
    @Param("jobId") jobId: string
  ) {
    return this.queueMonitorService.removeJob(queueName, jobId);
  }

  @Get("/:queueName/:jobId")
  async getJobDetail(
    @Param("queueName") queueName: string,
    @Param("jobId") jobId: string
  ) {
    console.debug(`getJobDetail: ${queueName} ${jobId}`);
    return this.queueMonitorService.getJobDetail(queueName, jobId);
  }
}
