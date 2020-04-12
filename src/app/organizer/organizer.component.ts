import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService, Task} from '../shared/tasks.service';
import {Observable, Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[] = [];
  private sub: Subscription;

  constructor(
    public dateService: DateService,
    private tasksService: TasksService
  ) { }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap((date) => this.tasksService.getTasksByDay(date))
    ).subscribe(tasks => this.tasks = tasks);

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    const {title} = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.tasksService.createTask(task).subscribe(newTask => {
      this.tasks.push(newTask);
      this.form.reset();
    }, err => console.error(err));
  }

  onRemoveTask(task: Task) {
    this.tasksService.removeTask(task)
      .subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      }, err => console.log(err));
  }
}
