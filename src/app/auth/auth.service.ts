import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

@Injectable()
export class AuthService {
    private user: User | null;
    authChange = new Subject<boolean>();

    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth) {}

    registerUser(authData: AuthData) {
        this.afAuth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.authSuccessfully();
        }).catch(error=> {
            console.log(error);
        });
       
    }

    login(authData: AuthData) {

        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.authSuccessfully();
        })
        .catch(error=>{
            console.log(error)
        })

    }

    logout() {
        this.user = null;
        this.isAuthenticated= false;
        this.authChange.next(false)
        this.router.navigate(['/login']);
    }

    getUser() {
        return { ...this.user };
    }

    isAuth() {
        return this.isAuthenticated;
    }

    private authSuccessfully() {
        this.isAuthenticated= true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}