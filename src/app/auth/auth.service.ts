import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { UIService } from "../shared/ui.service";
import { TrainingService } from "../training/training.service";
import { AuthData } from "./auth-data.model";
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();

    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<{ui: fromApp.State}>
    ) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false)
                this.router.navigate(['/login']);
            }
        })
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({type :'START_LOADING' });
        this.afAuth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch({type :'STOP_LOADING' });
            // this.uiService.loadingStateChanged.next(false);
        }).catch(error => {
            this.store.dispatch({type :'STOP_LOADING' });
            this.uiService.showSnackbar(error.message, null, 3000);
            // this.uiService.loadingStateChanged.next(false);
        });

    }



    login(authData: AuthData) {

        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({type :'START_LOADING' });
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.authSuccessfully();
                this.store.dispatch({type :'STOP_LOADING' });
                //  this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.store.dispatch({type :'STOP_LOADING' });
                this.uiService.showSnackbar(error.message, null, 3000);
                // this.uiService.loadingStateChanged.next(false);
            })

    }

    logout() {
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }


}