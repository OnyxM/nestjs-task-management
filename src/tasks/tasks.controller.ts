import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import {AuthGuard} from "@nestjs/passport";
import {User} from "../auth/user.entity";
import {GetUser} from "../auth/get-user.decorator";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}
  
  @Get()
  getTasks(
      @Query(ValidationPipe) filterDto: GetTasksFilterDto,
      @GetUser() user: User,
      ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User,
      ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
   deleteTask(@Param('id', ParseIntPipe) id: number,
              @GetUser() user: User,
              ): Promise<void> {
     return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task>
    {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
