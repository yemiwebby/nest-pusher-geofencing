
const USER_MARKER = 'http://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1526555652/user_my7yzc.png';
const OFFLINE_MARKER = 'http://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1526555651/offline_elrlvi.png';
const ONLINE_MARKER = 'http://res.cloudinary.com/yemiwebby-com-ng/image/upload/v1526555651/online_bpf5ch.png'
const RADIUS = 2000;


new Vue({
    el: '#app',
    data: {
        users: [],
    },
    
    created() {
        let pusher = new Pusher('YOUR_APP_KEY', {
            cluster: 'CLUSTER',
            encrypted: true
        });
        
        const channel = pusher.subscribe('map-geofencing');
        channel.bind('location', data => {
            this.initializeMap(data.person.position, data.people);
        });
    },
    mounted() {
        this.getUser();
    },
    methods: {
        getUser() {
            axios.get('/users').then(response => {
                this.users = this.getRandomUsers(response.data, 6)
            });
            
        },
        getRandomUsers(people, number) {
            const selected = [];
            for ( var i = 0; i < number; i++) {
                const index = Math.floor(Math.random() * people.length);
                if (selected.includes(index))  continue; 
                selected.push(index);
            }
            const selectedUsers = selected.map(index => {
                const users = { name, position } = people[index];
                return users;                
            });
            return selectedUsers;
        },
        
        getUserLocation(position) {
            const user = { position }
            axios.post('/users', user).then(response => {
                console.log(response);
            }) 
        },
        
        initializeMap(position, people) {
            const referencePoint = {lat:position.lat, lng:position.lng};
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: referencePoint,
                zoom: 13
            }) 
            for ( var i = 0; i < people.length; i++) {
                if (this.withinRegion(referencePoint, people[i], RADIUS)){
                    
                    this.addMarker(people[i], ONLINE_MARKER);
                } else {
                    this.addMarker(people[i], OFFLINE_MARKER);
                }
            }
            this.addCircle(position);
        },
        
        addMarker(props, marker) {
            this.marker = new google.maps.Marker({
                position: props.position,
                map: this.map,
                animation: google.maps.Animation.DROP,
                icon: marker
            })
        },
        addCircle(position) {
            this.circle = new google.maps.Circle({
                map: this.map,
                center: new google.maps.LatLng(position.lat, position.lng),
                radius: 2000,
                strokeColor: '#00ff00',
                fillColor: "#484040bf",
            });
        },
        
        withinRegion(position, user, radius) {
            const to = new google.maps.LatLng(user.position.lat, user.position.lng);
            const from = new google.maps.LatLng(position.lat, position.lng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
            return distance <= radius;
        },
        
        loadMoreUsers() {
            this.getUser();
        }
    }
})