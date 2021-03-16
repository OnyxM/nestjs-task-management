import {BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {TaskStatus} from "../tasks.model";

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  private isStatusValid(status: any){
    return this.allowedStatuses.indexOf(status) !== -1; // Si ça n'existe pas ça retourne '-1'
  }

  transform(value: any) {
    if (value === null) {
      throw new BadRequestException('Status cannot be null');
    }
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }
}