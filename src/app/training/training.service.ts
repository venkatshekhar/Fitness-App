import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { from, Subject, Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
import { Excercise } from "./excercise.model";
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions'
import { Store } from "@ngrx/store";



@Injectable()
export class TrainingService {

    excerciseChanged = new Subject<Excercise>();
    private availableExcercises: Excercise[] = []
    private runningExcercise: Excercise;
    exChanged = new Subject<Excercise[]>();
    finishedExerciseChanged = new Subject<Excercise[]>();
    private fbSubs: Subscription[] = [];


    constructor(private fireDB: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) { }

    fetchAvailableExcercises() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.fireDB.collection('availableExercises').snapshotChanges().pipe(map((docArray: any[]) => {
            return docArray.map(doc => {
                return {
                    id: doc.payload.doc.id,
                    // ...doc.payload.doc.data()
                    // use if we have different key name
                    name: doc.payload.doc.data().name,
                    duration: doc.payload.doc.data().duration,
                    calories: doc.payload.doc.data().calories,
                }
            });
            // throw(new Error());
        })).subscribe((exercises: Excercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching excercise Failed', null, 3000);
            this.exChanged.next(null);
        }));
    }

    startExcercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }


    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDatatoDatabase({ ...ex, date: new Date(), state: 'completed' });
            this.store.dispatch(new Training.StopTraining());
        });

    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDatatoDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        })
    }

    fetchCompletedOrCancelledExcercises() {
        this.fbSubs.push(this.fireDB.collection('finishedExercises').valueChanges().subscribe((exercises: Excercise[]) => {
            this.store.dispatch(new Training.SetFinishedTrainings(exercises))
        }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDatatoDatabase(excercise: Excercise) {
        this.fireDB.collection('finishedExercises').add(excercise);
    }


}