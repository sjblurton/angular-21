import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({ name: 'distanceToNow' })
export class DistanceToNowPipe implements PipeTransform {
  transform(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
