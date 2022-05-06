import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Excercise } from "./excercise.model";

@Injectable()
export class TrainingService {

    excerciseChanged = new Subject<Excercise>();
    private availableExcercises: Excercise[] = []
    private runningExcercise: Excercise;
    exChanged = new Subject<Excercise[]>();
    finishedExerciseChanged = new Subject<Excercise[]>();
    private fbSubs : Subscription[]=[];


    constructor(private fireDB: AngularFirestore) { }

    fetchAvailableExcercises() {
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
        })).subscribe((exercises: Excercise[])=>{
            this.availableExcercises= exercises;
            this.exChanged.next([...this.availableExcercises]);
        }));
    }

    startExcercise(selectedId: string) {
        this.runningExcercise = this.availableExcercises.find(ex => ex.id === selectedId);
        this.excerciseChanged.next({ ...this.runningExcercise });
    }

    getRunningExcercise() {
        return { ...this.runningExcercise }
    }

    completeExercise() {
        this.addDatatoDatabase({ ...this.runningExcercise, date: new Date(), state: 'completed' });
        this.runningExcercise = null;
        this.excerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDatatoDatabase({
            ...this.runningExcercise,
            duration: this.runningExcercise.duration * (progress / 100),
            calories: this.runningExcercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExcercise = null;
        this.excerciseChanged.next(null);
    }

    fetchCompletedOrCancelledExcercises() {
        this.fbSubs.push(this.fireDB.collection('finishedExercises').valueChanges().subscribe((exercises : Excercise[])=>{
            this.finishedExerciseChanged.next(exercises);
        }));
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDatatoDatabase(excercise : Excercise){
        this.fireDB.collection('finishedExercises').add(excercise);
    }


}