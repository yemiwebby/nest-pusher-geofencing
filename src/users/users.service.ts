
import { Component } from '@nestjs/common';
const people = require('./users');

@Component()
export class UsersService {    
    
    getAllUsers(){        
        return people.map( (person, index) => ({
            name: person.name,
            position: person.position,
        }));
    }
   
    intializePusher() {
        const Pusher = require('pusher');
        const pusher = new Pusher({
            appId: 'YOUR_APP_ID',
            key: 'YOUR_APP_KEY',
            secret: 'YOUR_SECRET_KEY',
            cluster: 'CLUSTER',
            encrypted: true
        });
        
        return pusher;
    }
    
    postLocation(user) {
        const Pusher = require('pusher');
        const {lat, lng} = user.position
        
        people.forEach( (person, index) => {
            if (person.position.lat === user.position.lat) {
                people[index] = { ...person, position: { lat, lng } };
                return this.intializePusher().trigger('map-geofencing', 'location', {person: people[index], people})
            }
        })
    }
}