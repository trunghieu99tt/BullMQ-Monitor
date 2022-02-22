import {
  Body,
  Controller,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers";
import Container, { Service } from "typedi";
import { CheckConnectionInput } from "../redis/dtos/check-connection-input.dto";
import { GetJobListQuery } from "./dtos/get-job-list-query-params.dto";
import { JobActionInput } from "./dtos/job-action-input.dto";
import { QueueActionInput } from "./dtos/queue-action-input.dto";
import { UpdateJobInput } from "./dtos/update-job-input.dto";
import { QueueMonitorService } from "./queue-monitor.service";

@Controller("queue-monitor")
@JsonController("/queue-monitor")
@Service()
export class QueueMonitorController {
  constructor(private readonly queueMonitorService: QueueMonitorService) {
    this.queueMonitorService = Container.get(QueueMonitorService);
  }

  @Post("/init-info")
  async initConnectionQueues(
    @Body() input: CheckConnectionInput
  ): Promise<boolean> {
    return this.queueMonitorService.getQueueListInConnection(input);
  }

  @Get("/redis")
  async getRedisInfo() {
    return this.queueMonitorService.getRedisInfo();
  }

  @Post("/job-list")
  async getJobList(@Body() getJobListBody: GetJobListQuery) {
    return this.queueMonitorService.getJobsByTypes(
      getJobListBody.connectionStr,
      getJobListBody.queueName,
      getJobListBody.jobTypes,
      getJobListBody.page,
      getJobListBody.pageSize
    );
  }

  @Post("/update-job")
  async updateJob(@Body() updateJobBody: UpdateJobInput) {
    const { connectionStr, data, jobId, queueName } = updateJobBody;

    return this.queueMonitorService.updateJob(
      connectionStr,
      queueName,
      jobId,
      data
    );
  }

  @Post("/count")
  async getJobCounts(@Body() input: QueueActionInput) {
    const { connectionStr, queueName } = input;
    console.debug(`getJobCounts: ${queueName}`);
    return this.queueMonitorService.getJobCounts(connectionStr, queueName);
  }

  @Post("/pause")
  async pauseQueue(@Body() input: QueueActionInput) {
    console.debug(`pauseQueue: ${input.queueName}`);
    const { connectionStr, queueName } = input;
    return this.queueMonitorService.pauseQueue(connectionStr, queueName);
  }

  @Post("/resume")
  async resumeQueue(@Body() input: QueueActionInput) {
    console.debug(`resumeQueue: ${input.queueName}`);
    const { connectionStr, queueName } = input;
    return this.queueMonitorService.resumeQueue(connectionStr, queueName);
  }

  @Post("/retry")
  async retryJob(@Body() input: JobActionInput) {
    const { connectionStr, jobId, queueName } = input;
    return this.queueMonitorService.retryJob(connectionStr, queueName, jobId);
  }

  @Delete("/:connectionStr/:queueName/:jobId")
  async removeJob(
    @Param("connectionStr") connectionStr: string,
    @Param("queueName") queueName: string,
    @Param("jobId") jobId: string
  ) {
    return this.queueMonitorService.removeJob(connectionStr, queueName, jobId);
  }

  @Post("/detail")
  async getJobDetail(@Body() input: JobActionInput) {
    const { connectionStr, jobId, queueName } = input;

    console.debug(`getJobDetail: ${queueName} ${jobId}`);
    return this.queueMonitorService.getJobDetail(
      connectionStr,
      queueName,
      jobId
    );
  }

  @Get("/:connectionStr")
  async getAllQueuesOfConnection(
    @Param("connectionStr") connectionStr: string
  ) {
    console.debug("getAllQueuesInfo");
    return this.queueMonitorService.getQueuesOfConnection(connectionStr);
  }
}
