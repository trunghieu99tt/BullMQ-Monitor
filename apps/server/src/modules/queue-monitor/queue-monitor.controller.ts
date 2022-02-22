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

// dtos
import { JobActionInput } from "./dtos/job-action-input.dto";
import { UpdateJobInput } from "./dtos/update-job-input.dto";
import { QueueMonitorService } from "./queue-monitor.service";
import { QueueActionInput } from "./dtos/queue-action-input.dto";
import { GetJobListQuery } from "./dtos/get-job-list-query-params.dto";
import { CheckConnectionInput } from "../redis/dtos/check-connection-input.dto";

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
    console.debug(
      `${this.initConnectionQueues} was called`,
      JSON.stringify(input, null, 2)
    );
    return this.queueMonitorService.getQueueListInConnection(input);
  }

  @Post("/job-list")
  async getJobList(@Body() getJobListInput: GetJobListQuery) {
    console.debug(
      `${this.getJobList} was called`,
      JSON.stringify(getJobListInput, null, 2)
    );

    const { connectionStr, jobTypes, page, pageSize, queueName } =
      getJobListInput;
    return this.queueMonitorService.getJobsByTypes(
      connectionStr,
      queueName,
      jobTypes,
      page,
      pageSize
    );
  }

  @Post("/update-job")
  async updateJob(@Body() updateJobBody: UpdateJobInput) {
    console.debug(
      `${this.updateJob} was called`,
      JSON.stringify(updateJobBody, null, 2)
    );

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
    console.debug(
      `${this.getJobCounts} was called`,
      JSON.stringify(input, null, 2)
    );

    const { connectionStr, queueName } = input;
    return this.queueMonitorService.getJobCounts(connectionStr, queueName);
  }

  @Post("/pause")
  async pauseQueue(@Body() input: QueueActionInput) {
    console.debug(
      `${this.pauseQueue} was called`,
      JSON.stringify(input, null, 2)
    );

    const { connectionStr, queueName } = input;
    return this.queueMonitorService.pauseQueue(connectionStr, queueName);
  }

  @Post("/resume")
  async resumeQueue(@Body() input: QueueActionInput) {
    console.debug(
      `${this.resumeQueue} was called`,
      JSON.stringify(input, null, 2)
    );

    const { connectionStr, queueName } = input;
    return this.queueMonitorService.resumeQueue(connectionStr, queueName);
  }

  @Post("/retry")
  async retryJob(@Body() input: JobActionInput) {
    console.debug(
      `${this.retryJob} was called`,
      JSON.stringify(input, null, 2)
    );

    const { connectionStr, jobId, queueName } = input;
    return this.queueMonitorService.retryJob(connectionStr, queueName, jobId);
  }

  @Delete("/:connectionStr/:queueName/:jobId")
  async removeJob(
    @Param("connectionStr") connectionStr: string,
    @Param("queueName") queueName: string,
    @Param("jobId") jobId: string
  ) {
    console.debug(
      `${this.removeJob} was called`,
      JSON.stringify(
        {
          connectionStr,
          queueName,
          jobId,
        },
        null,
        2
      )
    );

    return this.queueMonitorService.removeJob(connectionStr, queueName, jobId);
  }

  @Post("/detail")
  async getJobDetail(@Body() input: JobActionInput) {
    console.debug(
      `${this.getJobDetail} was called`,
      JSON.stringify(input, null, 2)
    );

    const { connectionStr, jobId, queueName } = input;
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
    console.debug(`${this.getAllQueuesOfConnection} was called`, connectionStr);
    return this.queueMonitorService.getQueuesOfConnection(connectionStr);
  }
}
